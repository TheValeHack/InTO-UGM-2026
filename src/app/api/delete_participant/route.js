import connectToDatabase from "@/lib/db";
import Participant from "@/models/Participant";
import Order from "@/models/Order";
import { auth } from "@/auth";
import admin from "@/data/admins.json";

export async function DELETE(req) {
    try {
        const session = await auth();

        if (!session || !session.user || !admin.includes(session.user.email)) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        await connectToDatabase();

        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({ error: "ID peserta harus disertakan." }),
                { status: 400 }
            );
        }

        // Find the participant first to make sure they exist
        const participant = await Participant.findById(id);
        if (!participant) {
            return new Response(
                JSON.stringify({ error: "Peserta tidak ditemukan." }),
                { status: 404 }
            );
        }

        // Find the order that contains this participant
        const order = await Order.findOne({ participant_ids: id });

        if (order) {
            // Remove participant ID from the order
            order.participant_ids = order.participant_ids.filter(
                (pId) => pId.toString() !== id
            );

            if (order.participant_ids.length === 0) {
                // If no more participants, delete the order
                await Order.findByIdAndDelete(order._id);
            } else {
                // Otherwise, update the order (maybe adjust total price if needed, 
                // but for now let's just keep it simple as these are manual entries)
                await order.save();
            }
        }

        // Delete the participant
        await Participant.findByIdAndDelete(id);

        return new Response(
            JSON.stringify({ success: true, message: "Peserta berhasil dihapus." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting participant:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
