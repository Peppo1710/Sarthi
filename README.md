# 🌟 Sarthi AI - Your Compassionate AI Companion

<div align="center">

**An empathetic AI companion application featuring 3D avatars, voice interaction, and personalized AI personas for elderly users**

[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Conversational%20AI-6B8E23?style=for-the-badge)](https://elevenlabs.io)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)

</div>

---

## 📖 Overview

**Sarthi** (सारथी - meaning "guide" or "companion" in Sanskrit/Hindi) is an AI-powered conversational application designed specifically for elderly Indian users. It provides emotional support, companionship, and assistance through lifelike 3D avatars with natural voice interaction.

### ✨ Key Features

- 🎭 **Three Unique AI Personas** - Sakhi, Sutradhar, and Uday with distinct personalities
- 🗣️ **Real-Time Voice Conversation** - Powered by ElevenLabs Conversational AI
- 🎨 **3D Avatars** - Lifelike Ready Player Me avatars with lip-sync and emotional expressions
- 🎤 **Voice Customization** - Select from 8 different voice options
- 🖼️ **Vision Support** - Share images for AI analysis (powered by Google Gemini 2.0 Flash)
- 🌐 **Bilingual Support** - Seamless Hindi and English conversation
- 📱 **Phone Authentication** - Simple OTP-based login system
- 🎨 **Warm Embrace UI** - Elderly-friendly design with large fonts and intuitive navigation

---

## 🎭 Meet the Personas

Sarthi offers three distinct AI companions, each designed to support different emotional needs:

### 🌙 Sakhi (सखी) - The Empathetic Listener

**Tagline:** "The Listener"

A warm, compassionate companion who truly understands your feelings. Sakhi excels at active listening and emotional validation.

- **Best for:** Processing emotions, feeling heard, emotional support
- **Personality:** Soft, nurturing, like a caring friend or daughter
- **Color Theme:** Purple (#8B5CF6)
- **Agent ID:** `VITE_ELEVENLABS_LUNA_AGENT_ID`

**Recommended System Prompt:**
```
You are Sakhi (सखी), a warm and empathetic AI companion for elderly Indian users. 
Your primary role is to listen actively and provide emotional support. You validate 
feelings, offer gentle guidance, and create a safe space for users to express themselves.

Personality traits:
- Speak with warmth, patience, and deep understanding
- Use occasional Hindi words naturally (like "haan", "theek hai", "bilkul")
- Be a compassionate listener who asks thoughtful follow-up questions
- Validate emotions before offering solutions
- Speak slowly and clearly for elderly users

Tone: Soft, nurturing, like a caring friend or daughter
```

---

### 📚 Sutradhar (सूत्रधार) - The Memory Keeper

**Tagline:** "The Memory Keeper"

Helps you cherish and organize your precious memories. Sutradhar assists in reminiscing, documenting life stories, and preserving important moments.

- **Best for:** Reminiscing, memory support, storytelling, life review
- **Personality:** Wise, respectful, like a thoughtful grandson or cultural guide
- **Color Theme:** Blue (#0EA5E9)
- **Agent ID:** `VITE_ELEVENLABS_GEORGE_AGENT_ID`

**Recommended System Prompt:**
```
You are Sutradhar (सूत्रधार), a thoughtful AI assistant who helps elderly Indian 
users preserve and celebrate their precious memories. You assist in reminiscing 
about past experiences, organizing stories, and finding meaning in their life journey.

Personality traits:
- Speak with wisdom, curiosity, and gentle encouragement
- Ask about specific memories and details
- Help users see patterns and meaning in their life stories
- Use respectful language appropriate for elders
- Mix Hindi and English naturally

Tone: Wise, respectful, like a thoughtful grandson or cultural guide
```

---

### ☀️ Uday (उदय) - The Day Brightener

**Tagline:** "The Day Brightener"

Brings joy and positivity to every conversation. Uday's cheerful energy helps lift spirits and find the silver lining.

- **Best for:** Mood lifting, positive reinforcement, daily motivation
- **Personality:** Cheerful, encouraging, like an optimistic friend or energetic grandchild
- **Color Theme:** Yellow (#f9c74f)
- **Agent ID:** `VITE_ELEVENLABS_SUNNY_AGENT_ID`

**Recommended System Prompt:**
```
You are Uday (उदय - meaning "sunrise"), an uplifting AI companion who brings 
positivity and joy to elderly Indian users. Your goal is to help users find 
silver linings, celebrate small wins, and approach life with optimism.

Personality traits:
- Speak with enthusiasm, warmth, and infectious positivity
- Find the bright side while remaining authentic (not toxic positivity)
- Use cheerful Hindi expressions ("wah!", "bahut accha!", "shabash!")
- Celebrate small victories and daily joys
- Be energetic but not overwhelming for elderly users

Tone: Cheerful, encouraging, like an optimistic friend or energetic grandchild
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SARTHI AI SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND (React 19 + Vite)                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   Persona    │  │   Chat       │  │    3D        │               │   │
│  │  │   Selector   │  │   Page       │  │   Avatar     │               │   │
│  │  │              │  │              │  │ (TalkingHead)│               │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │   │
│  │         │                 │                 │                        │   │
│  │         └────────────────┐│┌────────────────┘                        │   │
│  │                          │││                                         │   │
│  │                    ┌─────┴┴┴─────┐                                   │   │
│  │                    │  Chatpage   │                                   │   │
│  │                    │  (Main UI)  │                                   │   │
│  │                    └──────┬──────┘                                   │   │
│  └───────────────────────────┼──────────────────────────────────────────┘   │
│                              │                                              │
│  ┌───────────────────────────┼──────────────────────────────────────────┐   │
│  │                           ▼                                          │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │           ELEVENLABS CONVERSATIONAL AI (WebSocket)           │    │   │
│  │  │                                                              │    │   │
│  │  │   ┌──────────┐    ┌──────────┐    ┌──────────┐              │    │   │
│  │  │   │  Sakhi   │    │Sutradhar │    │  Uday    │   Agents     │    │   │
│  │  │   │  Agent   │    │  Agent   │    │  Agent   │              │    │   │
│  │  │   └──────────┘    └──────────┘    └──────────┘              │    │   │
│  │  │                                                              │    │   │
│  │  │   • Speech-to-Text (STT)                                    │    │   │
│  │  │   • LLM Processing (GPT-4 class)                            │    │   │
│  │  │   • Text-to-Speech (TTS)                                    │    │   │
│  │  │   • Voice Streaming                                         │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                         EXTERNAL SERVICES                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      BACKEND (Node.js + Express)                      │   │
│  │                                                                       │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │   │   /api/      │  │   /api/      │  │   /api/      │               │   │
│  │   │   voices     │  │   analyze-   │  │   auth       │               │   │
│  │   │              │  │   image      │  │              │               │   │
│  │   └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  │          │                 │                 │                        │   │
│  │          ▼                 ▼                 ▼                        │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │   │  ElevenLabs  │  │   Gemini     │  │   MongoDB    │               │   │
│  │   │  Voices API  │  │   Vision     │  │   + Supabase │               │   │
│  │   └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + Vite | UI Framework with fast HMR |
| **3D Avatar** | TalkingHead + Three.js | Avatar rendering & viseme-based lip-sync |
| **Voice AI** | ElevenLabs Conversational AI | Complete STT → LLM → TTS pipeline |
| **Vision** | Google Gemini 2.0 Flash | Image analysis and description |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Supabase | User profiles and authentication |
| **Styling** | Tailwind CSS 4 + Inline Styles | Responsive UI with "Warm Embrace" theme |
| **Routing** | React Router v7 | Client-side navigation |
| **Animations** | Framer Motion + Type Animation | Smooth transitions and text effects |

---

## 📁 Project Structure

```
AI-avatar-avatar/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Avatar3D.jsx     # 3D avatar with TalkingHead
│   │   │   ├── ChatPanel.jsx    # Text chat sidebar (legacy)
│   │   │   ├── PersonaSelector.jsx  # Persona selection UI
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── VoiceSettings.jsx    # Voice customization
│   │   │   ├── AuthWizard.jsx   # Authentication flow
│   │   │   └── steps/           # Signup wizard steps
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Home page with animated hero
│   │   │   ├── LoginPage.jsx    # Phone + OTP authentication
│   │   │   ├── SignupPage.jsx   # Multi-step signup wizard
│   │   │   ├── CustomizePage.jsx # Voice selection
│   │   │   └── ProfilePage.jsx  # User profile (minimal)
│   │   ├── Chatpage.jsx         # Main conversation page
│   │   ├── App.jsx              # Root component with routing
│   │   ├── index.css            # Global styles & Tailwind
│   │   └── main.jsx             # Entry point
│   ├── public/
│   │   ├── avatars/
│   │   │   ├── david.glb        # Main 3D avatar model
│   │   │   ├── sakhi.png        # Persona selection images
│   │   │   ├── sutradhar.png
│   │   │   └── uday.png
│   │   ├── bg.png               # Chat background
│   │   └── heroheader.png       # Landing page hero image
│   ├── package.json
│   └── vite.config.js           # Vite configuration
│
├── backend/                     # Express.js backend
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── models/
│   │   └── Profile.js           # MongoDB user profile model
│   ├── server.js                # Main server file
│   ├── db.js                    # Supabase client
│   └── package.json
│
├── backend_1/                   # Python FastAPI (legacy/unused)
│   ├── app.py                   # Groq + ElevenLabs integration
│   └── requirements.txt
│
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **ElevenLabs Account** with API key and 3 configured agents
- **Google AI Studio Account** (for Gemini Vision API)
- **Supabase Account** (optional, for production auth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sarthi-ai.git
cd sarthi-ai
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sarthi

# ElevenLabs API Key (for backend voice fetching)
ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key

# ElevenLabs Agent IDs (CRITICAL - one for each persona)
VITE_ELEVENLABS_LUNA_AGENT_ID=agent_your_sakhi_agent_id
VITE_ELEVENLABS_GEORGE_AGENT_ID=agent_your_sutradhar_agent_id
VITE_ELEVENLABS_SUNNY_AGENT_ID=agent_your_uday_agent_id

# Fallback Agent ID (if persona-specific ID is missing)
VITE_ELEVENLABS_AGENT_ID=agent_your_default_agent_id

# Google Gemini API Key (for image analysis)
GEMINI_API_KEY=AIzaSy_your_gemini_api_key

# Supabase (optional, for production auth)
SUPABASE_URL=https://your-project.supabase.co/
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

# Server Port
PORT=3000
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Set Up ElevenLabs Agents

This is **CRITICAL** for different personas to work correctly.

1. Go to [ElevenLabs Agents Dashboard](https://elevenlabs.io/app/agents)
2. Create **3 separate agents** with the system prompts provided in the [Meet the Personas](#-meet-the-personas) section
3. Copy each agent ID and paste into your `.env` file:
   - Sakhi → `VITE_ELEVENLABS_LUNA_AGENT_ID`
   - Sutradhar → `VITE_ELEVENLABS_GEORGE_AGENT_ID`
   - Uday → `VITE_ELEVENLABS_SUNNY_AGENT_ID`

**Important:** Each agent MUST have a unique system prompt to create distinct personalities.

### 5. Run the Application

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Connected to MongoDB
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 🎛️ User Flow

### 1. **Landing Page**
- Animated "Sarthi" / "सारथी" title
- "Start Talking" CTA button
- Redirects to signup if not logged in

### 2. **Signup Flow** (Multi-step wizard)
- **Step 1:** Phone number entry
- **Step 2:** OTP verification (use `123456` in development)
- **Step 3:** Name input
- **Step 4:** Age selection
- **Step 5:** Tone preference (currently unused)

### 3. **Voice Customization**
- Select from 8 voice options
- Preview each voice before selecting
- Voice preference saved to localStorage

### 4. **Persona Selection**
- Immersive 3-pillar layout
- Hover effects with blur removal and glow
- Click to select: Sakhi, Sutradhar, or Uday

### 5. **Chat Interface**
- **Left:** 3D avatar with lip-sync
- **Right:** Chat transcript + microphone button
- Real-time voice conversation via ElevenLabs WebSocket
- Emotion detection (happy, sad, thinking, etc.)

---

## 🔧 API Endpoints

### Backend (Node.js/Express)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/auth/send-otp` | POST | Send OTP (mock mode) |
| `/api/auth/verify-otp` | POST | Verify OTP (accepts `123456`) |
| `/api/auth/profile` | POST | Save/update user profile |
| `/api/voices` | GET | Fetch ElevenLabs voices |
| `/api/analyze-image` | POST | Analyze image with Gemini Vision |

### Request/Response Examples

**POST /api/auth/verify-otp**
```json
// Request
{
  "phone": "+919876543210",
  "token": "123456"
}

// Response
{
  "message": "Login successful",
  "session": { "access_token": "mock-jwt-token" },
  "user": { "phone": "+919876543210", "id": "..." },
  "profile": { "phone": "+919876543210", "name": null, ... }
}
```

**POST /api/analyze-image**
```json
// Request
{
  "image": "base64_encoded_image_data",
  "mimeType": "image/jpeg",
  "prompt": "Describe this image in detail"
}

// Response
{
  "description": "The image shows a beautiful sunset over mountains..."
}
```

---

## 🎨 UI Design - "Warm Embrace" Theme

### Color Palette

```css
/* Primary Background */
--bg-primary: #FDFCF0;      /* Warm cream */

/* Text Colors */
--text-primary: #2D2926;    /* Dark brown */
--text-secondary: #666666;  /* Medium gray */

/* Accent Colors */
--accent-primary: #E07A5F;  /* Terracotta */
--accent-sakhi: #8B5CF6;    /* Purple */
--accent-sutradhar: #0EA5E9; /* Blue */
--accent-uday: #f9c74f;     /* Yellow */
```

### Typography

- **Headings:** Georgia, serif (warm, classic)
- **Body:** System fonts (readable, accessible)
- **Taglines:** 'Caveat', cursive (friendly, handwritten feel)

### Design Principles

1. **Large Font Sizes** - Minimum 18px for elderly users
2. **High Contrast** - Dark text on light backgrounds
3. **Generous Spacing** - Ample padding and margins
4. **Clear CTAs** - Large, rounded buttons with shadows
5. **Minimal Clutter** - One primary action per screen

---

## 🐛 Troubleshooting

### Issue: All personas sound the same

**Cause:** Agent IDs not configured correctly or all agents have the same system prompt in ElevenLabs dashboard.

**Solution:**
1. Verify `.env` has unique agent IDs for each persona
2. Restart the frontend dev server: `npm run dev`
3. Check browser console for logs:
   ```
   🔍 ENV CHECK: {
     SAKHI: "agent_9601...",
     SUTRADHAR: "agent_6801...",
     UDAY: "agent_0801..."
   }
   ```
4. If all IDs are the same or undefined, check your `.env` file
5. Ensure each ElevenLabs agent has a **different system prompt**

### Issue: Avatar not loading

**Cause:** TalkingHead library initialization failed or avatar file missing.

**Solution:**
1. Check browser console for errors
2. Verify `/public/avatars/david.glb` exists
3. Clear browser cache and reload
4. Check that Three.js and TalkingHead are installed:
   ```bash
   cd frontend
   npm install @met4citizen/talkinghead three
   ```

### Issue: WebSocket disconnection

**Cause:** ElevenLabs WebSocket closes unexpectedly, often due to voice overrides.

**Solution:**
- Voice overrides are currently disabled in `Chatpage.jsx` (lines 149-166)
- If you need custom voices, configure them directly in the ElevenLabs agent settings
- Check ElevenLabs dashboard for agent status

### Issue: MongoDB connection error

**Cause:** Invalid connection string or network issue.

**Solution:**
1. Verify `MONGO_URI` in `.env`
2. For MongoDB Atlas, whitelist your IP address
3. Check MongoDB server is running (if local)
4. Test connection:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
   ```

### Issue: Gemini Vision API error

**Cause:** Invalid API key or quota exceeded.

**Solution:**
1. Verify `GEMINI_API_KEY` in `.env`
2. Check quota at [Google AI Studio](https://aistudio.google.com/)
3. Ensure API key has Gemini API enabled

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist/` folder to Vercel or Netlify

3. Set environment variables in the hosting platform:
   - `VITE_BACKEND_URL`
   - `VITE_ELEVENLABS_LUNA_AGENT_ID`
   - `VITE_ELEVENLABS_GEORGE_AGENT_ID`
   - `VITE_ELEVENLABS_SUNNY_AGENT_ID`
   - `VITE_ELEVENLABS_AGENT_ID`

### Backend (Railway/Render/Heroku)

1. Deploy the `backend/` folder

2. Set environment variables:
   - `MONGO_URI`
   - `ELEVENLABS_API_KEY`
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PORT`

3. Update `VITE_BACKEND_URL` in frontend to point to deployed backend

---

## 🔐 Security Notes

- **OTP Authentication:** Currently in mock mode (accepts `123456`). For production, integrate Supabase Auth or Twilio.
- **API Keys:** Never commit `.env` to version control
- **CORS:** Currently allows all origins (`*`). Restrict in production.
- **MongoDB:** Use strong passwords and IP whitelisting
- **Rate Limiting:** Add rate limiting middleware for production

---

## 📝 Development Notes

### Key Files to Understand

1. **`Chatpage.jsx`** - Main conversation UI, handles ElevenLabs WebSocket, persona switching
2. **`Avatar3D.jsx`** - TalkingHead wrapper, manages 3D avatar and lip-sync
3. **`PersonaSelector.jsx`** - Persona configuration and UI
4. **`server.js`** - Backend API routes
5. **`vite.config.js`** - Important: `envDir: '../'` loads `.env` from root

### Environment Variable Loading

- Vite only loads env vars prefixed with `VITE_`
- Env vars are loaded at **build time**, not runtime
- **CRITICAL:** Restart dev server after changing `.env`

### Adding New Personas

1. Create a new agent in ElevenLabs dashboard
2. Add agent ID to `.env`:
   ```bash
   VITE_ELEVENLABS_NEW_PERSONA_AGENT_ID=agent_xxx
   ```
3. Update `PERSONAS` array in `Chatpage.jsx`:
   ```javascript
   {
     id: 'new-persona',
     name: 'New Name',
     hindiName: 'नया नाम',
     tagline: 'The Description',
     description: 'Detailed description',
     agentId: import.meta.env.VITE_ELEVENLABS_NEW_PERSONA_AGENT_ID || '',
     avatar: '/avatars/new-avatar.glb',
     image: '/avatars/new-persona.png',
     color: '#HEX_COLOR',
     glowColor: 'rgba(r, g, b, 0.4)'
   }
   ```
4. Add persona image to `/public/avatars/new-persona.png`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io) - Conversational AI platform
- [TalkingHead](https://github.com/met4citizen/TalkingHead) - 3D avatar library
- [Ready Player Me](https://readyplayer.me) - Avatar creation
- [Google Gemini](https://ai.google.dev) - Vision AI
- [MongoDB](https://www.mongodb.com) - Database
- [Supabase](https://supabase.com) - Authentication

---

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@sarthi-ai.com (if applicable)

---

<div align="center">

**Built with ❤️ for elderly users who deserve compassionate AI companionship**

*Sarthi - Your guide, your friend, your companion*

</div>
