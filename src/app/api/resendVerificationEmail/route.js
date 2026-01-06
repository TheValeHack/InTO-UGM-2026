import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { emailQueue } from '@/lib/queue';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required.' }), { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
        }

        if (user.is_verified) {
            return new Response(JSON.stringify({ message: 'Email is already verified.' }), { status: 200 });
        }

        // Delete existing tokens if any
        await VerificationToken.deleteMany({ userId: user._id });

        // Generate new token
        const token = crypto.randomBytes(32).toString('hex');
        const verificationToken = new VerificationToken({ userId: user._id, token });
        await verificationToken.save();

        // Add to email queue
        await emailQueue.add('verification', {
            type: 'verification',
            payload: { email, token },
        });

        return new Response(
            JSON.stringify({ message: 'Verification email resent successfully. Please check your inbox.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
