import connectToDatabase from "@/lib/db";
import Voucher from "@/models/Voucher";
import Package from "@/models/Package";

export async function POST(req) {
  try {
    const { voucher, packageName } = await req.json();

    await connectToDatabase();

    const selectedPackage = await Package.findOne({ name: packageName });
    if (!selectedPackage) {
      return new Response(JSON.stringify({ success: false, error: "Paket tidak ditemukan." }), { status: 404 });
    }

    const packagePrice = selectedPackage.price;

    const validVoucher = await Voucher.findOne({ code: voucher });

    if (!validVoucher) {
      return new Response(JSON.stringify({ success: false, error: "Voucher tidak ditemukan." }), { status: 404 });
    }

    const currentDate = new Date();
    if (currentDate > validVoucher.valid_until) {
      return new Response(
        JSON.stringify({ success: false, error: "Voucher sudah kedaluwarsa." }),
        { status: 400 }
      );
    }

    let discount = 0;
    if (validVoucher.type === "nominal") {
      discount = validVoucher.discount;
    } else if (validVoucher.type === "percentage") {
      discount = (packagePrice * validVoucher.discount) / 100;
    }

    discount = Math.min(discount, packagePrice);

    return new Response(
      JSON.stringify({ success: true, discount }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
