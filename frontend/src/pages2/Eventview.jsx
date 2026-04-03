import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../pages/miniComponents/Navbar";
import { ThemeContext } from "../context/ThemeContext.js"; // Import ThemeContext
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventView = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { darkMode } = useContext(ThemeContext); // Access theme state
  const [hasRSVPed, setHasRSVPed] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/event/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  const handlePayment = async (eventId, amount, receiverId) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("Please login to proceed with payment!");
      return;
    }

    let senderId;
    try {
      const decoded = jwtDecode(token);
      senderId = decoded.id;
    } catch (err) {
      console.error("Token decode failed:", err);
      alert("Invalid token. Please login again.");
      return;
    }
    // 🔥 Check if already RSVP / paid
const checkRes = await axios.post(
  `${BASE_URL}/payment/check-rsvp`,
  { eventId, senderId , receiverId }, // ✅ include receiverId
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }
);

  if (checkRes.data.alreadyPurchased) {
      const status = checkRes.data.status;
      console.log("RSVP status:", status);
      if (status === "Going") {
        alert("✅ You already joined this event!");
      } else {
        alert("⏳ You already paid. Wait for RSVP confirmation.");
      }

      return;
    }
    try {
      const { data } = await axios.post(
        `${BASE_URL}/payment/create-order`,
        { amount, senderId, receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (!data.success) {
        alert("⚠️ Failed to create order. Try again.");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "EventSync",
        description: "Ticket Purchase",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            await axios.post(
              `${BASE_URL}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              },
            );

            alert("✅ Payment Successful!");
            handleRSVP(eventId, receiverId);
          } catch (verifyError) {
            console.error(
              "Verification failed:",
              verifyError.response?.data || verifyError,
            );
            alert("❌ Payment verification failed.");
          }
        },

        prefill: {
          name: "Shraddha",
          email: "vkumarranju9@gmail.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert("❌ Something went wrong while creating order.");
    }
  };

  const handleRSVP = async (eventId, receiverId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/rsvp/${eventId}`,
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send RSVP!");
    }
  };

  if (!event) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-500 min-h-screen pb-12 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28">
        {/* Main Event Card */}
        <div
          className={`rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 ${
            darkMode
              ? "bg-slate-900 border-slate-800 shadow-blue-900/10"
              : "bg-white border-slate-100 shadow-slate-200"
          }`}
        >
          {/* Header Image Section */}
          <div className="relative h-[450px]">
            <img
              src={event.featureImage?.url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mt-3 leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column: Description & Metadata */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    About the Event
                  </h3>
                  <p
                    className={`text-lg leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Date & Time",
                      icon: "📅",
                      val: new Date(event.startDateTime).toLocaleString(),
                    },
                    {
                      label: "Location",
                      icon: "📍",
                      val: event.locationName || "Virtual Location",
                    },
                    { label: "Platform/Medium", icon: "🌍", val: event.medium },
                    { label: "Privacy", icon: "🔒", val: event.privacy },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${
                        darkMode
                          ? "bg-slate-800/40 border-slate-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {item.icon} {item.label}
                      </p>
                      <p className="font-bold text-sm">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Actions Sticky Card */}
              <div className="lg:col-span-1">
                <div
                  className={`sticky top-32 p-8 rounded-[2rem] border space-y-4 ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="text-center mb-6">
                    <p
                      className={`text-xs font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Registration Status
                    </p>
                    <p className="text-2xl font-black text-blue-500 mt-1">
                      Open Now
                    </p>
                  </div>

                  {/* Payment & RSVP Buttons */}
                  <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {event.isPaid ? (
                      <button
                        onClick={() =>
                          handlePayment(event._id, event.price, event.userId)
                        }
                        className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      >
                        💰 Buy Ticket (₹{event.price})
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRSVP(event._id, event.userId)}
                        className={`w-full md:w-auto ${
                          hasRSVPed
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                        } text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
                        disabled={hasRSVPed}
                      >
                        🎟️ {hasRSVPed ? "RSVP Sent" : "RSVP Now"}
                      </button>
                    )}

                    <button
                      className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      onClick={() => {
                        const subject = encodeURIComponent(
                          `Invitation: ${event.title}`,
                        );
                        const body = encodeURIComponent(
                          `Hey,\n\nCheck out this amazing event: ${event.title}\n\nDescription: ${
                            event.description
                          }\n\nDate: ${new Date(event.startDateTime).toLocaleString()}\n\nJoin here: ${
                            window.location.href
                          }\n\nHope to see you there!`,
                        );
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}
                    >
                      🔗 Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;
