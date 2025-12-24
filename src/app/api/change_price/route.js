import { auth } from "@/auth";
import connectToDatabase from '@/lib/db';
import Package from '@/models/Package';
import fs from 'fs/promises';
import path from 'path';
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

    const { id, price } = await req.json();

    if (!id || !price) {
      return new Response(
        JSON.stringify({ error: 'ID paket dan harga baru harus diisi.' }),
        { status: 400 }
      );
    }

    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return new Response(
        JSON.stringify({ error: 'Harga harus berupa angka positif.' }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { price: numericPrice },
      { new: true }
    );

    if (!updatedPackage) {
      return new Response(
        JSON.stringify({ error: 'Paket tidak ditemukan di database.' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Harga paket berhasil diubah.' }),
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
