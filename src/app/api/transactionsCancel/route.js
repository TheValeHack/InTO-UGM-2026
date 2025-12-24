import { auth } from "@/auth";
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Midtrans from 'midtrans-client';

let coreApi = new Midtrans.CoreApi({
  isProduction: process.env.IS_PRODUCTION === 'true',
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(req) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { order_id } = await req.json();

    await connectToDatabase();

    const orderData = await Order.findOne({ _id: order_id });
    if (!orderData) {
      return new Response(JSON.stringify({ error: 'Transaksi tidak ditemukan.' }), { status: 404 });
    }

    if (orderData.user_id.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await coreApi.transaction.cancel(order_id);

    orderData.payment_status = 'cancel';
    await orderData.save();

    return new Response(JSON.stringify({ success: true, message: 'Transaksi berhasil dibatalkan.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
