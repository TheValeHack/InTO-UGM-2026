import { auth } from "@/auth";
import connectToDatabase from '@/lib/db';
import Voucher from '@/models/Voucher';
import admin from '@/data/admins.json';

export async function DELETE(req) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        if (!admin.includes(session.user.email)) {
            return new Response(JSON.stringify({ error: 'Access denied' }), { status: 403 });
        }

        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'ID voucher harus disertakan.' }),
                { status: 400 }
            );
        }

        await connectToDatabase();

        const deletedVoucher = await Voucher.findByIdAndDelete(id);

        if (!deletedVoucher) {
            return new Response(
                JSON.stringify({ error: 'Voucher tidak ditemukan.' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Voucher berhasil dihapus.' }),
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
