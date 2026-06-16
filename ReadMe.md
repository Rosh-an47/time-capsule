# Time Capsule

*Send memories forward. Reconnect when it matters.*

---

## What Is This?

Time Capsule lets you seal memories — photos, voice notes, messages — and schedule them for delivery years into the future. Send a message to your future self when you're feeling low. Share a memory with friends who might have drifted apart by then. The capsule waits. On a random day, when the time is right, it unlocks.

Not another social media app. Not another todo list. This is intentional nostalgia.

---

## How It Works

1. **Create an account** — just a username, email, and password. Optional profile picture.
2. **Build a capsule** — upload photos, record a voice message, or write something down. Add a caption. Set the unlock date.
3. **Choose recipients** — add your own email (for future you) or your friends' emails. They don't even need an account.
4. **Seal it** — the capsule locks. Nobody can open it until the date you set.
5. **Time passes** — live your life. Forget about it.
6. **Surprise** — one random day after the unlock date, you (and your recipients) get pinged with the memory.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React (Vite), React Router, Axios |
| **Backend** | Node.js, Express |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT (access + refresh tokens), httpOnly cookies |
| **File Storage** | Cloudinary (images, videos, voice notes) |
| **File Upload** | Multer |

---

## Project Structure
Time-Capsule/
├── client/ # React frontend
│ └── src/
│ ├── components/ # Reusable UI pieces
│ ├── pages/ # Landing, Register, Login, Dashboard, CreateCapsule
│ ├── context/ # AuthContext (global user state)
│ └── services/ # Axios API instance
│
└── server/ # Express backend
└── src/
├── controllers/ # Business logic (user, capsule)
├── models/ # Mongoose schemas (User, Capsule, Recipient)
├── routes/ # API route definitions
├── middlewares/ # Auth verification, file upload (Multer)
├── utils/ # Cloudinary upload helper
└── db/ # MongoDB connection


---

## What's Built So Far

- [x] User registration (with profile picture upload)
- [x] User login (email or username)
- [x] JWT authentication with refresh token rotation
- [x] Logout (cookie clearing)
- [x] Session persistence (stay logged in on refresh)
- [x] Protected routes (dashboard only for logged-in users)
- [x] Landing page, Register page, Login page, Dashboard
- [ ] Capsule creation with media upload *(in progress)*
- [ ] Capsule unlock scheduler
- [ ] Email delivery system
- [ ] Received capsules view

---

## Running It Locally

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (for media uploads)

### Backend Setup

```bash
cd server
npm install

Create a .env file in server/:
env

PORT=5000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_other_secret_here
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

bash

npm run dev

Frontend Setup
bash

cd client
npm install
npm run dev

Visit http://localhost:5173.
API Endpoints
Auth
Method	Endpoint	Description	Auth
POST	/api/v1/users/register	Create account	No
POST	/api/v1/users/login	Sign in	No
POST	/api/v1/users/logout	Sign out	Yes
GET	/api/v1/users/me	Get current user	Yes
Capsules (coming soon)
Method	Endpoint	Description	Auth
POST	/api/v1/capsules	Create a capsule	Yes
GET	/api/v1/capsules	Get user's capsules	Yes
GET	/api/v1/capsules/received	Get received capsules	Yes
Design Decisions Worth Mentioning

Why httpOnly cookies for JWT?
Storing tokens in localStorage is vulnerable to XSS attacks. httpOnly cookies can't be read by JavaScript — they're automatically sent with requests. More secure. The tradeoff is slightly more complex CORS configuration, but it's worth it.

Why .lean() on database queries?
Mongoose documents have circular references and getters/setters that break JSON serialization. Calling .lean() returns plain JavaScript objects — faster, lighter, and plays nice with res.json().

Why separate User and Recipient models?
A capsule can be sent to people who don't have accounts yet. Recipients are identified by email first, optionally linked to a User later when they sign up. This keeps the door open for non-users to receive capsules.
What I Learned Building This

    JWT refresh token rotation isn't just about security — it's about user experience (staying logged in)

    Multer's disk storage is a temporary middleman; always clean up files after Cloudinary upload

    Mongoose's pre('save') hook is perfect for password hashing — it just works

    FormData is non-negotiable when sending files from frontend to backend

    Circular JSON errors in Mongoose are a rite of passage — .lean() saves the day

The Hard Parts (Still Figuring Out)

    Capsule unlock scheduler: Cron job that checks every hour? Queue system? What's the right approach for a small-scale app?

    Email delivery reliability: What if the recipient changes their email in 5 years? Multiple fallback channels?

    Storage costs over time: Cloudinary is great now. Will it be sustainable with thousands of videos stored for years?

    Trust: How do you convince a user the app will still exist in 2031?


