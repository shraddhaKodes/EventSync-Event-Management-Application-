import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { verifyEmail, sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar  are required!", 400));
  }

  const { avatar} = req.files;
  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
  } = req.body;

  // **🔹 Verify Email before proceeding**
  const isEmailValid = await verifyEmail(email);
  if (!isEmailValid) {
    return next(
      new ErrorHandler("Invalid Email! Please use a valid email address.", 400)
    );
  }
  console.log("to upload files");
  // **🔹 Upload Avatar to Cloudinary**
  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "EVENT WEBSITES AVATAR" }
  );
  if (!cloudinaryResponseForAvatar.secure_url) {
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  // **🔹 Send Registration Confirmation Email**
  const emailSubject = "Welcome to Our Platform!";
 const emailMessage = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      
      <h2 style="color: #2c3e50; text-align: center;">🎉 Welcome to EventSync</h2>
      
      <p style="font-size: 16px; color: #555;">
        Hi <b>${fullName}</b>,
      </p>
      
      <p style="font-size: 15px; color: #555;">
        Your account has been successfully created. You’re now ready to explore and join amazing events!
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #3399cc; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">
          Explore Events
        </a>
      </div>

      <p style="font-size: 14px; color: #777;">
        Discover events, connect with people, and never miss out on opportunities.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 13px; color: #999; text-align: center;">
        If you didn’t sign up for this account, please ignore this email.
      </p>

      <p style="font-size: 14px; color: #333; margin-top: 20px;">
        Best Regards,<br/>
        <b>Team EventSync</b>
      </p>

    </div>

  </div>
`;

  console.log("try to send message");
  await sendEmail(email, emailSubject, emailMessage);

  // **🔹 Create User in Database**
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
  });

  // **🔹 Generate Token and Respond**
  generateToken(user, "Registered Successfully!", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }
  const user = await User.findOne({ email }).select("password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email!", 404));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid  Password", 401));
  }
  generateToken(user, "Login Successfully!", 200, res);
  
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out!",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    instagramURL: req.body.instagramURL,
    facebookURL: req.body.facebookURL,
    twitterURL: req.body.twitterURL,
    linkedInURL: req.body.linkedInURL,
  };
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const newProfileImage = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "PORTFOLIO AVATAR",
      }
    );
    newUserData.avatar = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated!",
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user.id).select("password");
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill All Fields.", 400));
  }
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password!"));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler("New Password And Confirm New Password Do Not Match!")
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// **Forgot Password**
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  // **Generate Reset Token**
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // **Create Reset Password URL**
  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  // **Email Content**
  const emailSubject = "EventSync Password Recovery";
  const emailMessage = `Hello ${user.fullName},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nTeam`;

  console.log(`📩 Sending password reset email to: ${user.email}`);
  console.log(`🔗 Reset URL: ${resetPasswordUrl}`);

  try {
    // **Send Email**
    await sendEmail(user.email, emailSubject, emailMessage);

    console.log("✅ Email Sent Successfully!");

    res.status(201).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.error("❌ Error Sending Email:", error);

    // **Reset Token if Email Fails**
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent. Please try again.", 500));
  }
});

//RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log("enter for the reset password") ;
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match"));
  }
  user.password =  req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, "Reset Password Successfully!", 200, res);
});

export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({}); // Use await
  res.status(200).json({
    success: true,
    users,
  });
});
