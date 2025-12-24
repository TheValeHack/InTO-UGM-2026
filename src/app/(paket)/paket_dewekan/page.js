"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTransaction } from "@/contexts/TransactionContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutBox from "@/components/CheckoutBox";
import PaymentPending from "@/components/PaymentPending";
import GradientTitle from "@/components/GradientTitle";

export default function PaketDewekan() {
  const [paket, setPaket] = useState([]);
  const { data: session, status } = useSession();
  const { lastOrder, isLoadingPaymentStatus, fetchTransactionDetails, isProcessing } =
    useTransaction();
  const isLoading = status === "loading";
  const router = useRouter();

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

  useEffect(() => {
    const snapScript = process.env.NEXT_PUBLIC_SNAP_URL;
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    async function fetchPaketData() {
      try {
        const response = await fetch("/api/all_packages");
        if (response.ok) {
          const data = await response.json();
          const paketData = data.packages.find((item) => item.name.toLowerCase() === "dewekan");
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
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading || isLoadingPaymentStatus) {
    return <></>;
  }

  return (
    <div className="w-full overflow-hidden">
      <Navbar className={"navbar"} session={session} />
      <div className="max-w-[1950px] mx-auto flex flex-col w-screen relative">
        <section
          id="paket"
          className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
        >
          {lastOrder?.payment_status === "pending" ? (
            <PaymentPending
              packageId={lastOrder?.package_id}
              token={lastOrder?.payment_token}
              orderId={lastOrder?._id}
            />
          ) : (
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <div className="flex flex-col items-center gap-5">
                <GradientTitle title1="Paket" title2="Dewekan" />
                <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center text-[#591D6A]">
                  Paket Dewekan adalah paket untuk 1 peserta, yang
                  diperuntukkan bagi peserta yang sudah memiliki akun. Data
                  akun Anda akan digunakan untuk mendaftar sebagai peserta
                </div>
              </div>
              <CheckoutBox
                kode="Dewekan"
                className={"mt-12"}
                name={paket.name}
                desc={paket.desc}
                price={paket.price}
                validateParticipants={() => ""}
              />
              {/* <CheckoutBox
                kode="dewekan"
                className={"mt-8"}
                name={'Dewekan'}
                desc={'Paket Dewekan adalah paket untuk 1 peserta, yang diperuntukkan bagi peserta yang sudah memiliki akun. Data akun Anda akan digunakan untuk mendaftar sebagai peserta'}
                price={48000}
                validateParticipants={() => ""}
              /> */}
            </div>
          )}
        </section>
        <Footer />
      </div>
    </div>
  );
}
