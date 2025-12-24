import connectToDatabase from '@/lib/db';
import VerificationToken from '@/models/VerificationToken';
import User from '@/models/User';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  await connectToDatabase();

  const verificationToken = await VerificationToken.findOne({ token });
  if (!verificationToken) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
  }

  const user = await User.findById(verificationToken.userId);
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
  }

  user.is_verified = true;
  await user.save();

  await VerificationToken.deleteOne({ token });

  return new Response(JSON.stringify({ message: 'Email verified successfully' }), { status: 200 });
}