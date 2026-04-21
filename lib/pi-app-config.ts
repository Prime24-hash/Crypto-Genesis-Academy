/**
 * Pi Network Application Configuration
 * For "Crypto Genesis Academy" app registered in Pi Developer Portal
 * 
 * Instructions:
 * 1. Go to https://developers.pi.io/
 * 2. Register your app
 * 3. Get your App ID from the Developer Portal
 * 4. Replace "Crypto Genesis Academy" below with your actual App ID
 * 5. Deploy to Vercel
 * 
 * The appId MUST match exactly what you registered in Pi Developer Portal
 */

export const PI_APP_CONFIG = {
  // Use your actual App ID from Pi Developer Portal
  appId: "Crypto Genesis Academy",
  version: "2.0",
  sandbox: false, // Set to true for testing on testnet
} as const;
