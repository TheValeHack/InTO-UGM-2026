"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BubbleButton from "@/components/BubbleButton";
import { useEffect } from "react";
import { useTransaction } from "@/contexts/TransactionContext";
import GradientTitle from "@/components/GradientTitle";

export default function Thanks() {
  const { data: session, status } = useSession();
  const { lastOrder, isLoadingPaymentStatus, fetchTransactionDetails, isProcessing } = useTransaction();
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
    if (lastOrder?.payment_status === "pending") {
      router.back();
    } else if (lastOrder?.payment_status !== "paid") {
      router.push("/");
    }
  }, [lastOrder, router]);

  if (isLoading || isLoadingPaymentStatus) {
    return <></>;
  }

  return (
    session && (
      <div className="w-full overflow-hidden">
        <Navbar className={"navbar"} session={session} />
        <div className="max-w-[1950px] mx-auto flex flex-col w-screen relative">
          <section
            id="payment"
            className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
          >
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <div className="flex flex-col items-center gap-7">
                <GradientTitle title1="Terima" title2="Kasih" />
                <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center text-[#591D6A]">
                  Terima kasih telah melakukan pembelian paket TO di InTO UGM 2026. Tetapi, maaf kamu hanya bisa melakukan satu kali pembelian di dalam satu akun.
                  <br />
                  <br />
                  <BubbleButton
                    scale={3}
                    color="pink"
                    className="text-xl sm:text-3xl py-3 min-w-full"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Kembali ke Menu Utama
                  </BubbleButton>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    )
  );
}
