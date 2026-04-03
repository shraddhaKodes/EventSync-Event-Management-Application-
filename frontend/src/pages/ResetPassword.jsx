import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      return toast.error("Please fill in both fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/password/reset/${token}`,
        { password, confirmPassword },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="bg-gray-700 p-8 rounded-xl shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
        <p className="text-gray-300 text-sm mb-4">Enter a new password for your account.</p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p
          className="mt-4 text-sm text-gray-300 cursor-pointer hover:text-blue-400 transition"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
