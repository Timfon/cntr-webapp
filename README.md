# CNTR AISLE Web Application

A Next.js web application for scoring legislation bills using a structured scorecard system. Built by the Center for Technological Responsibility, Reimagination, and Redesign (CNTR) at Brown University.

## Overview

CNTR AISLE enables users to evaluate legislation bills through a comprehensive scorecard with multiple sections covering topics like accountability, transparency, oversight, and data privacy. The application saves progress automatically and allows users to flag questions for review.

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Backend**: Firebase (Authentication & Firestore)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CNTR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # Enable Firebase Emulators for local development
   NEXT_PUBLIC_USE_EMULATORS=true
   ```

   > **Note**: Get your Firebase credentials from the [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps

### Development with Firebase Emulators (Recommended)

Using Firebase Emulators allows you to develop locally without affecting production data.

1. **Start emulators and dev server together**
   ```bash
   npm run dev:emulated
   ```

   Or run separately in two terminals:
   ```bash
   # Terminal 1 - Firebase Emulators
   npm run emulators

   # Terminal 2 - Next.js Dev Server
   npm run dev
   ```

2. **Access the application**
   - **App**: http://localhost:3000
   - **Emulator UI**: http://localhost:4000
   - **Firestore Emulator**: localhost:8080
   - **Auth Emulator**: localhost:9099

### Development with Production Firebase

To connect to production Firebase instead of emulators:

1. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_EMULATORS=false
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run emulators` | Start Firebase emulators only |
| `npm run dev:emulated` | Start both emulators and dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |


## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Update environment variables**
   
   Ensure `NEXT_PUBLIC_USE_EMULATORS` is set to `false` or removed in production environment.

3. **Deploy**
   
   The app is optimized for deployment on [Vercel](https://vercel.com):
   ```bash
   vercel deploy
   ```

   Or use any Next.js-compatible hosting platform.

## Team

Built by the [CNTR](https://cntr.brown.edu/) team at Brown University.

## 📄 License

© Brown University 2025

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
