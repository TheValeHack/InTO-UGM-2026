import { auth } from "@/auth";
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Package from '@/models/Package';
import Participant from '@/models/Participant';


export async function GET(req) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const userId = req.headers.get('user-id');

    if (!userId || userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    await connectToDatabase();

    const activeOrder = await Order.findOne({
      user_id: userId,
      payment_status: 'paid',
    }).populate('package_id participant_ids');

    if (!activeOrder) {
      return new Response(JSON.stringify({ error: 'No active package found.' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        package: activeOrder.package_id,
        participants: activeOrder.participant_ids,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
