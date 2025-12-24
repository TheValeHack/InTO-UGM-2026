"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import BubbleButton from "@/components/BubbleButton";
import Footer from "@/components/Footer";
import GradientTitle from "@/components/GradientTitle";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [modalLogin, setModalLogin] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
          setMessage("Token tidak valid.");
          setStatus("error");
          return;
        }

        try {
          const response = await fetch(`/api/sendVerificationEmail?token=${token}`);
          console.log(response);

          if (response.ok) {
            const data = await response.json();
            setMessage(data.message);
            setStatus("success");

            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            const errorData = await response.json();
            setMessage(errorData.error || "Terjadi kesalahan.");
            setStatus("error");
          }
        } catch (error) {
          console.log(error);
          setMessage("Terjadi kesalahan tak terduga.");
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, [router]);

  if (status == "") {
    return <></>
  }

  return (
    <div className="w-full overflow-hidden">
      <Navbar className={"navbar"} session={session} modalLogin={modalLogin} setModalLogin={setModalLogin} />
      <div className="max-w-[1950px] mx-auto flex flex-col w-screen relative">
        <section
          id="payment"
          className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
        >
          <div className="px-6 md:px-12 lg:px-16 w-full relative">
            <div className="flex flex-col items-center gap-7">
              {
                status == "success" ? (
                  <GradientTitle title1="Verifikasi" title2="Berhasil" />
                ) : (
                  <GradientTitle title1="Verifikasi" title2="Gagal" />
                )
              }
              <div className="w-full max-w-[800px] text-sm sm:text-base md:text-xl text-center text-[#591D6A]">
                {
                  status == "success" ? "Verifikasi email berhasil. redirecting..." : message
                }
                <br /><br />
                <BubbleButton
                  scale={3}
                  color="pink"
                  className="text-xl sm:text-3xl py-3 min-w-full"
                  onClick={() => {
                    router.push("/")
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
