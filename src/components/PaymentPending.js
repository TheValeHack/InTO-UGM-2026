import BubbleButton from "@/components/BubbleButton";
import { useEffect, useState } from "react";
import GradientTitle from "./GradientTitle";

export default function PaymentPending({ token, packageId, orderId }) {
  const [packageName, setPackageName] = useState("");

  useEffect(() => {
    const fetchPackageName = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`);
        if (response.ok) {
          const data = await response.json();
          setPackageName(data.name);
        } else {
          console.error("Gagal mengambil nama paket");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    if (packageId) {
      fetchPackageName();
    }
  }, [packageId]);

  const handleCancelTransaction = async () => {
    try {
      const response = await fetch("/api/transactionsCancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.reload();
      } else {
        alert(data.error || "Gagal membatalkan transaksi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Gagal membatalkan transaksi.");
    }
  };

  return (
    <div className="px-6 md:px-12 lg:px-16 w-full relative">
      <div className="flex flex-col items-center gap-5">
        <GradientTitle title1="Pembayaran" title2="Belum Selesai" />
        <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center">
          <div className="text-[#591D6A]">
            Pembayaran anda untuk pembelian paket {packageName || "Loading..."} belum selesai,
            silahkan lanjutkan pembayaran anda atau batalkan transaksi.
          </div>
          <div className="flex flex-col mt-5 gap-3 [text-shadow:none] shadow-none">
            <BubbleButton
              scale={4}
              color="default"
              className="text-xl sm:text-3xl py-4 min-w-full"
              onClick={() => {
                window.snap.pay(token);
              }}
            >
              Lanjutkan Pembayaran
            </BubbleButton>
            <BubbleButton
              scale={4}
              color="pink"
              className="text-xl sm:text-3xl py-4 min-w-full"
              onClick={handleCancelTransaction}
            >
              Batalkan Transaksi
            </BubbleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
