import { auth } from "@/auth";
import connectToDatabase from '@/lib/db';
import Voucher from '@/models/Voucher';
import admin from '@/data/admins.json';

export async function POST(req) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!admin.includes(session.user.email)) {
      return new Response(JSON.stringify({ error: 'Access denied' }), { status: 403 });
    }

    const { id, code, type, value, validUntil } = await req.json();

    if (!code || !type || !value || !validUntil) {
      return new Response(
        JSON.stringify({ error: 'Semua field harus diisi.' }),
        { status: 400 }
      );
    }

    if (type === 'percentage' && value > 100) {
      return new Response(
        JSON.stringify({ error: 'Diskon persentase harus kurang dari atau sama dengan 100.' }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    let voucher;
    if (id) {
      voucher = await Voucher.findById(id);
      if (voucher) {
        voucher.code = code;
        voucher.type = type;
        voucher.discount = value;
        voucher.valid_until = new Date(validUntil);
        await voucher.save();
      } else {
        return new Response(
          JSON.stringify({ error: 'Voucher tidak ditemukan untuk diedit.' }),
          { status: 404 }
        );
      }
    } else {
      let existingVoucher = await Voucher.findOne({ code });

      if (existingVoucher) {
        existingVoucher.type = type;
        existingVoucher.discount = value;
        existingVoucher.valid_until = new Date(validUntil);
        await existingVoucher.save();
        voucher = existingVoucher;
      } else {
        voucher = new Voucher({
          code,
          type,
          discount: value,
          valid_until: new Date(validUntil),
        });
        await voucher.save();
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: id ? 'Voucher berhasil diupdate.' : 'Voucher berhasil ditambahkan.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
