import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();
                if (!credentials?.email || !credentials?.password) return null;

                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("Email atau password salah!");
                if (!user.is_verified) throw new Error("Verifikasi email anda terlebih dahulu sebelum login.");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Email atau password salah!");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    school: user.school,
                    phone: user.phone,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.user) {
                session.user = token.user;
            }
            return session;
        },
    },
    pages: {
        signIn: "/", // Modal based login usually stays on the same page
    },
    secret: process.env.NEXTAUTH_SECRET,
});
