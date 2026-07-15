// Cookie options for accessToken/refreshToken.
//
// Locally: frontend (localhost:5173) and backend (localhost:8000) are
// different ports but the SAME site, over http. secure:true + sameSite:"none"
// would be silently dropped by the browser over plain http, so we need
// secure:false + sameSite:"lax" in dev.
//
// In prod: frontend (vercel.app) and backend (onrender.com) are different
// sites entirely, both over https. That requires secure:true + sameSite:"none"
// or the browser won't send the cookie back on cross-site requests.
const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};