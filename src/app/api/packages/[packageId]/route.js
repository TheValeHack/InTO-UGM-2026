import connectToDatabase from "@/lib/db";
import Package from "@/models/Package";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { packageId } = params;
    const selectedPackage = await Package.findById(packageId);

    if (!selectedPackage) {
      return new Response(JSON.stringify({ error: "Paket tidak ditemukan." }), { status: 404 });
    }

    return new Response(JSON.stringify({ name: selectedPackage.name }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
