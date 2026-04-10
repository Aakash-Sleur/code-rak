import { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Generate a device ID from request headers
 * This creates a consistent identifier for the same device
 */
export function generateDeviceId(request: NextRequest): string {
    const userAgent = request.headers.get("user-agent") || "";
    const acceptLanguage = request.headers.get("accept-language") || "";
    
    // Create a hash from user agent and language to identify the device
    // This is a simple approach; in production, consider client-side device UUID
    const deviceFingerprint = `${userAgent}-${acceptLanguage}`;
    return crypto.createHash("sha256").update(deviceFingerprint).digest("hex");
}

/**
 * Extract device name from user agent
 */
export function getDeviceName(userAgent: string | null): string {
    if (!userAgent) return "Unknown Device";
    
    const ua = userAgent.toLowerCase();
    
    if (ua.includes("iphone")) return "iPhone";
    if (ua.includes("ipad")) return "iPad";
    if (ua.includes("android")) return "Android";
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("macintosh")) return "Mac";
    if (ua.includes("linux")) return "Linux";
    
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    
    return "Unknown Device";
}

/**
 * Extract IP address from request
 */
export function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "unknown"
    );
}
