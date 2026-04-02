# IGNITE'25 — College Fest Website

A modern, dark-themed fest website built with React + Vite + Firebase Firestore.

## Features

- Home page with animated hero, marquee, and featured events
- Events page with live search and category filters (solo / doubles / team)
- Event detail page with full info and direct registration link
- Registration form with dynamic fields — auto-adapts for solo, doubles, and team events
- Leaderboard with live branch standings computed from Firestore results collection

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18 + Vite                 |
| Routing   | React Router v6                 |
| Animation | Framer Motion                   |
| Backend   | Firebase Firestore (NoSQL DB)   |
| Deploy    | Vercel                          |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd ignite-fest
npm install
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. Click **Build → Firestore Database → Create database** → start in **production mode**
3. Go to **Project Settings → Your Apps → Add app → Web** and copy the config object
4. In Firestore → **Rules**, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{id}        { allow read: true; }
    match /results/{id}       { allow read: true; }
    match /registrations/{id} { allow create: true; }
  }
}
```

### 3. Configure environment

```bash
cp .env.example .env
# Fill in your 6 Firebase values
```

### 4. Seed the database

Edit `firebase_seed.js`, paste your firebaseConfig at the top, then:

```bash
node firebase_seed.js
```

This populates all 8 events and sample results.

### 5. Run locally

```bash
npm run dev
# Open http://localhost:5173
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all 6 `VITE_FIREBASE_*` env vars in Vercel dashboard
4. Deploy — `vercel.json` handles SPA routing

---

## Firestore Collections

### `events`
| Field       | Type     | Notes                       |
|-------------|----------|-----------------------------|
| name        | string   | Event name                  |
| date        | string   | e.g. "Apr 18"               |
| venue       | string   | Venue name                  |
| category    | string   | "solo" / "doubles" / "team" |
| description | string   | Short description           |
| rules       | string[] | List of rule strings        |
| emoji       | string   | Display emoji               |
| image_url   | string   | Optional banner image URL   |

### `registrations`
| Field        | Type         | Notes                                       |
|--------------|--------------|---------------------------------------------|
| name         | string       | Participant name                            |
| semester     | string       | "2" / "4" / "6" / "8" / "MBA"              |
| branch       | string       | CSE / ISE / AIML / ECE etc.                 |
| contact      | string       | Phone number                                |
| event_id     | string       | Firestore event doc ID                      |
| team_name    | string|null  | Only for team events                        |
| team_members | array|null   | null (solo), 2-item (doubles), n-item (team)|
| createdAt    | timestamp    | Auto-set via serverTimestamp()              |

### `results`
| Field    | Type   | Notes                       |
|----------|--------|-----------------------------|
| event_id | string | Firestore event doc ID      |
| branch   | string | Branch name                 |
| position | number | 1, 2, or 3                  |
| points   | number | 10 / 6 / 3                  |

---

## Adding Results (after events)

Firebase Console → Firestore → `results` → **Add document**:
```
eventId:  <paste event doc ID>
branch:   "CSE"
position: 1
points:   10
```

Leaderboard updates on next page load.

---

## Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx + .module.css
│   └── EventCard.jsx + .module.css
├── pages/
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── EventDetail.jsx
│   ├── Register.jsx
│   └── Leaderboard.jsx
├── services/
│   └── firebase.js        ← ALL Firestore calls live here
├── App.jsx
├── main.jsx
└── index.css
```
