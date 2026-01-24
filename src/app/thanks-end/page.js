"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BubbleButton from "@/components/BubbleButton";
import GradientTitle from "@/components/GradientTitle";

export default function ThanksEnd() {
  const router = useRouter();

  return (
    <div className="w-full overflow-hidden">
      <Navbar className={"navbar"} />
      <div className="max-w-[2160px] mx-auto flex flex-col w-screen relative">
        <section
          id="payment"
          className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
        >
          <div className="px-6 md:px-12 lg:px-16 w-full relative">
            <div className="flex flex-col items-center gap-7">
              <GradientTitle title1="Terima" title2="Kasih" />
              <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center text-[#591D6A]">
                Terima kasih telah berpartisipasi dalam InTO UGM 2026, sampai jumpa di InTO UGM 2027!!!
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
  );
}
