import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRY = "1h"; // Access token expires in 1 hour

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = (): string => {
  // This generates a random token that will be hashed and stored in DB
  // The actual refresh token = random + userId + timestamp
  const crypto = require("crypto");
  return crypto.randomBytes(32).toString("hex");
};
