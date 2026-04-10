import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined")
}

interface Cached {
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null 
}

declare global {
    var mongooseCache: Cached | undefined
}

const globalWithCache = global as typeof global & {
    mongooseCache?: Cached
}

const cached = globalWithCache.mongooseCache || {
    conn: null,
    promise: null
}

globalWithCache.mongooseCache = cached

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI);
    }

    cached.conn = await cached.promise
    return cached.conn
}