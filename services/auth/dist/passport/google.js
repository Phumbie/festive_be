"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        email: profile.emails?.[0]?.value || '',
                        firstName: profile.name?.givenName || '',
                        lastName: profile.name?.familyName || '',
                        emailVerified: true,
                    },
                });
            }
            return done(null, user);
        }
        catch (err) {
            return done(err, undefined);
        }
    }));
}
else {
    console.log('⚠️ Google OAuth not configured - skipping Google authentication setup');
}
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
});
