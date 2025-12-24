"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutBox from "@/components/CheckoutBox";
import BubbleInput from "@/components/BubbleInput";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentPending from "@/components/PaymentPending";
import { useTransaction } from "@/contexts/TransactionContext";
import GradientTitle from "@/components/GradientTitle";

export default function PaketBelimo() {
  const [paket, setPaket] = useState([]);
  const { data: session, status } = useSession();
  const { lastOrder, isLoadingPaymentStatus, fetchTransactionDetails, isProcessing } = useTransaction();
  const isLoading = status === "loading";
  const router = useRouter();

  const [participants, setParticipants] = useState([
    { name: "", school: "", email: "", phone: "" },
    { name: "", school: "", email: "", phone: "" },
    { name: "", school: "", email: "", phone: "" },
    { name: "", school: "", email: "", phone: "" },
  ]);

  const handleParticipantChange = (index, field, value) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const validateParticipants = () => {
    for (let i = 0; i < participants.length; i++) {
      const { name, school, email, phone } = participants[i];
      if (!name || !school || !email || !phone) {
        return `Data peserta ${i + 2} belum lengkap. Semua data harus diisi.`;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return `Email peserta ${i + 2} tidak valid.`;
      }
      if (!/^\+?[0-9]{9,15}$/.test(phone.replace(/\s/g, ""))) {
        return `Nomor WhatsApp peserta ${i + 2} tidak valid.`;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/");
    }

    async function loadMidtrans() {
      try {
        const configRes = await fetch("/api/config/midtrans");
        const { clientKey, snapUrl } = await configRes.json();

        const script = document.createElement("script");
        script.src = snapUrl;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error("Failed to load Midtrans config:", error);
      }
    }

    const cleanupMidtrans = loadMidtrans();

    async function fetchPaketData() {
      try {
        const response = await fetch("/api/all_packages");
        if (response.ok) {
          const data = await response.json();
          const paketData = data.packages.find((item) => item.name.toLowerCase() === "belimo");
          setPaket(paketData);
        } else {
          console.error("Failed to fetch paket data");
        }
      } catch (error) {
        console.error("Error fetching paket data:", error);
      }
    }

    fetchPaketData();

    return () => {
      cleanupMidtrans.then((cleanup) => cleanup && cleanup());
    };
  }, [isLoading, session, router]);

  useEffect(() => {
    if (!isLoading && session && !isProcessing && isLoadingPaymentStatus) {
      fetchTransactionDetails();
    } else if (!isLoading && !session) {
      router.push("/");
    }
  }, [isLoading, session, router, fetchTransactionDetails, isProcessing, isLoadingPaymentStatus]);

  useEffect(() => {
    if (lastOrder?.payment_status === "paid") {
      router.push("/thanks");
    }
  }, [lastOrder]);

  if (isLoading || isLoadingPaymentStatus) {
    return <></>;
  }

  return (
    session && (
      <div className="w-full overflow-hidden">
        <Navbar className={"navbar"} session={session} />
        <div className="max-w-[2160px] mx-auto flex flex-col w-screen relative">
          <section id="paket" className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative">
            {lastOrder?.payment_status === "pending" ? (
              <PaymentPending
                packageId={lastOrder?.package_id}
                token={lastOrder?.payment_token}
                orderId={lastOrder?._id}
              />
            ) : (
              <div className="px-6 md:px-12 lg:px-16 w-full relative">
                <div className="flex flex-col items-center gap-5">
                  <GradientTitle title1="Paket" title2="Belimo" />
                  <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center text-[#591D6A]">
                    Paket Belimo adalah paket untuk 5 peserta. Harap lengkapi data untuk peserta 2 hingga 5 (data selain peserta yang memiliki akun)
                  </div>
                </div>
                <div className="flex flex-col mx-auto max-w-[1100px] gap-12 mt-12">
                  {participants.map((participant, index) => (
                    <div className="flex flex-col items-start gap-3" key={index}>
                      <div className="text-xl text-[#591D6A] font-bold">Data Peserta {index + 2}</div>
                      <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                        <div className="flex-1">
                          <label className="text-xs sm:text-base text-[#591D6A]">Nama</label>
                          <BubbleInput
                            value={participant.name}
                            onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs sm:text-base text-[#591D6A]">Asal Sekolah</label>
                          <BubbleInput
                            value={participant.school}
                            onChange={(e) => handleParticipantChange(index, "school", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                        <div className="flex-1">
                          <label className="text-xs sm:text-base text-[#591D6A]">E-Mail <span className="font-semibold">(Pastikan benar, tiket akan dikirim ke email)</span></label>
                          <BubbleInput
                            value={participant.email}
                            onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs sm:text-base text-[#591D6A]">Nomor Whatsapp</label>
                          <BubbleInput
                            value={participant.phone}
                            onChange={(e) => handleParticipantChange(index, "phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <CheckoutBox
                  kode="Belimo"
                  className={"mt-16"}
                  name={paket.name}
                  desc={paket.desc}
                  price={paket.price}
                  participants={participants}
                  validateParticipants={validateParticipants}
                />
              </div>
            )}
          </section>
          <Footer />
        </div>
      </div>
    )
  );
}
