# EventSync – Scalable Global Event Management & Ticketing Ecosystem

### 📌 Project Overview
**EventSync** is a professional-grade, full-stack platform designed to revolutionize how global events are tracked, managed, and scaled. It serves as an all-in-one ecosystem that bridges the gap between event creators and attendees through real-time analytics, secure financial transactions, and automated communication workflows.

### 🚀 Tech Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Payments:** Razorpay API Integration
* **Mapping & Geo:** Leaflet.js / OpenStreetMap (for precise venue pinning)
* **Auth & Security:** JWT (JSON Web Tokens), Bcrypt.js, Secure Cookie Management
* **Media Hosting:** Cloudinary (Scalable image and avatar uploads)
* **Automation:** Nodemailer (SMTP-based notification engine)

### ✅ Key Features & Engineering Highlights
* **Financial Infrastructure:**
    * Integrated **Razorpay Payment Gateway** for seamless ticket purchasing.
    * Dynamic ticket logic: Users can "Buy Tickets" for paid public events or send "RSVP Requests" for private/free events.
* **Automated Notification Engine:**
    * **Signup Confirmation:** Users receive an immediate email upon account creation.
    * **RSVP Workflow:** Automated "Sender-to-Receiver" email alerts that notify event managers the moment an attendee submits an RSVP.
* **Social & Viral Integration:**
    * **One-Click Social Sharing:** Native integration to broadcast events directly to external platforms.
    * **Social Connectivity:** Unified sign-up and sign-in processes for frictionless onboarding.
* **Advanced Discovery & UX:**
    * **Geospatial Interaction:** Interactive map-based venue selection during event creation.
    * **Smart Filtering:** Multi-layered search by categories (Music, Tech, Arts, Literature, etc.) and medium (Online vs. In-person).
    * **Themed Experience:** Persistent Dark/Light mode support for enhanced readability.
* **Comprehensive Command Center:**
    * **Event Manager Dashboard:** Dedicated interface for organizers to track "Invites," "Notifications," and manage event lifecycles (Create/Edit/Delete).
    * **Real-time Analytics:** Visual tracking of event performance and attendee scaling.

### 🛠 Installation & Secure Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/EventSync.git](https://github.com/your-username/EventSync.git)
    cd EventSync
    ```

2.  **Configure Environment Variables (.env):**
    Create a `.env` file in the root directory to protect sensitive credentials:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_random_string
    RAZORPAY_KEY_ID=your_key_id
    RAZORPAY_KEY_SECRET=your_key_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    EMAIL_USER=your_automated_smtp_email
    EMAIL_PASS=your_app_specific_password
    ```

3.  **Run the Application:**
    ```bash
    # Install all dependencies
    npm install && cd frontend && npm install
   
    # Launch concurrently (Backend + Frontend)
    cd ..
    npm run dev
    ```

### 🛡 Security & Best Practices
* **Credential Isolation:** Strict use of `.env` files to ensure API keys (Razorpay, Cloudinary) remain secure and are excluded from version control.
* **Data Integrity:** Implemented robust server-side validation and sanitized MongoDB schemas for event and user collections.
* **Optimized Performance:** Leveraged Cloudinary for dynamic image optimization to ensure fast Largest Contentful Paint (LCP) across all devices.

---
*Developed by Shraddha Kumari as a high-impact engineering project demonstrating full-stack proficiency, financial security, and automated system architecture.*
