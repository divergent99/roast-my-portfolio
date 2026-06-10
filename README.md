# 🔥 Roast My Portfolio

![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Mind_the_Product-World_Product_Day_2026-orange?style=for-the-badge)

> *"You think you're a smart investor. Let's find out."*

An AI-powered portfolio roaster that analyzes your holdings and delivers brutally honest (and hilarious) feedback. Upload a screenshot of your Groww, Zerodha, or any brokerage portfolio and get roasted by a Ruthless VC, Gordon Ramsay, a Broke Uncle, or a Wall Street Bro.

**Live:** [roast-my-portfolio-two.vercel.app](https://roast-my-portfolio-two.vercel.app)

---

## What it does

- **Screenshot upload** -- drop any portfolio screenshot and Claude vision reads your holdings
- **Fully conversational** -- ask follow-up questions, get deeper analysis, argue back
- **Persona system** -- choose your roaster: Ruthless VC, Broke Uncle, SEBI Officer, Gordon Ramsay, Wall Street Bro
- **Vibe control** -- Savage, Brutally Honest, Sarcastic, Tough Love, Dark Humor
- **Multi-language** -- get roasted in English, Hindi, Hinglish, Spanish, French, German, Japanese, Arabic
- **Roast intensity slider** -- dial it from Gentle to Nuclear
- **Roast Card** -- download a shareable card with your portfolio verdict
- **3 themes** -- Terminal, Premium, Brutalist
- **Session history** -- rename, delete, and switch between conversations

---

## Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Anthropic](https://img.shields.io/badge/Claude_API-D97706?style=for-the-badge&logo=anthropic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

---

## Project Structure

```
roast-my-portfolio/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt
│   ├── Procfile             # Railway start command
│   └── routers/
│       └── chat.py          # /chat endpoint + prompt engineering
├── src/
│   ├── components/
│   │   ├── Aurora.jsx       # Animated background
│   │   ├── ChatWindow.jsx   # Main chat UI
│   │   ├── RoastCard.jsx    # Downloadable roast card
│   │   ├── SessionMenu.jsx  # Rename/delete sessions
│   │   ├── Sidebar.jsx      # Settings + history
│   │   └── ThemeSwitcher.jsx
│   ├── hooks/
│   │   └── useChat.js       # Session state + API calls
│   ├── utils/
│   │   ├── api.js           # Axios wrapper
│   │   └── themes.js        # Theme definitions
│   ├── App.jsx
│   └── index.css
├── index.html
└── vercel.json
```

---

## Running locally

**Frontend**
```bash
npm install
npm run dev
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
python -m uvicorn main:app --reload --port 8000
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8000`.

---

## How it works

Every chat message sends the full conversation history to the backend. The FastAPI endpoint builds a system prompt from your selected settings (persona, vibe, language, intensity, portfolio type, experience level) and passes everything to Claude's messages API. For image uploads, the portfolio screenshot is base64 encoded and sent as a vision message.

No conversation data is stored -- sessions live in React state and are cleared on page refresh.

---

## Built for

[Mind the Product: World Product Day 2026](https://mindtheproduct.devpost.com) -- *Everyone Ships Now*

---

## License

MIT
