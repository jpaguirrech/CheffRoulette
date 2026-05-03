// Firebase web app config for client-side use.
// These values are PUBLIC by design — they identify the Firebase project,
// not authenticate against it. Auth is handled by Firebase ID tokens at runtime.
// Source: `firebase apps:sdkconfig WEB <appId> --project cheff-roulette`

export const firebaseConfig = {
  projectId: "cheff-roulette",
  appId: "1:489187873945:web:7d953f9a0d4233ce88d408",
  storageBucket: "cheff-roulette.firebasestorage.app",
  apiKey: "AIzaSyBew6C8wUbxxtEgtSuRnlNXjIAb13a36jQ",
  authDomain: "cheff-roulette.firebaseapp.com",
  messagingSenderId: "489187873945",
  measurementId: "G-PV28LYFVEK",
} as const;
