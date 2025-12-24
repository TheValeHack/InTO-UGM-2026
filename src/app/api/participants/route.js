import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Participant from '@/models/Participant';
import Package from '@/models/Package';
import { auth } from "@/auth";
import admin from '@/data/admins.json';

export async function GET(req) {
  try {
    const session = await auth();

    if (!session || !session.user || !admin.includes(session.user.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ payment_status: 'paid' })
      .populate({
        path: 'participant_ids',
        select: '_id name email phone school kode is_user created_at',
      })
      .populate({
        path: 'package_id',
        select: '_id name desc price max_participants',
      })
      .select('_id user_id package_id participant_ids total_price created_at');

    const convertToIndonesiaTime = (utcDate) => {
      try {
        if (!utcDate) {
          return null;
        }
        const date = new Date(utcDate);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        const options = { timeZone: 'Asia/Jakarta', hour12: false };
        return new Intl.DateTimeFormat('id-ID', {
          ...options,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(date);
      } catch (error) {
        console.error(`Failed to convert date: ${utcDate}`, error);
        return null;
      }
    };


    const participantData = orders.map((order) => ({
      order_id: order._id,
      package: order.package_id ? {
        id: order.package_id._id,
        name: order.package_id.name,
        description: order.package_id.desc,
        price: order.package_id.price,
        max_participants: order.package_id.max_participants,
      } : null,
      participants: order.participant_ids.map((participant) => ({
        id: participant._id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        school: participant.school,
        kode: participant.kode,
        is_user: participant.is_user,
        created_at: convertToIndonesiaTime(participant.created_at)
      })),
      total_price: order.total_price,
      created_at: order.created_at,
    }));

    return new Response(JSON.stringify({ success: true, data: participantData }), { status: 200 });
  } catch (error) {
    console.error('Error fetching participant data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
