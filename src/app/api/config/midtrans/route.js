import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        snapUrl: process.env.MIDTRANS_SNAP_URL,
    });
}
