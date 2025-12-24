import BubbleButton from "./BubbleButton";
import cn from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import BubbleInput from "./BubbleInput";
import { useState } from "react";
import axios from "axios";
import BluePanel from "./BluePanel";
import BannerTitle from "./BannerTitle";

export default function CheckoutBox({ className, name, desc, price, kode, validateParticipants, participants }) {
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
  };

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    setVoucherError("");
    setDiscount(0);

    if (!voucher.trim()) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucher,
          packageName: kode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDiscount(data.discount);
      } else if (response.status === 404) {
        setVoucherError(data.error || "Voucher tidak ditemukan atau tidak valid.");
      } else if (response.status === 400) {
        setVoucherError(data.error || "Voucher tidak valid.");
      } else {
        setVoucherError("Terjadi kesalahan pada server.");
      }
    } catch (error) {
      console.error(error);
      setVoucherError("Terjadi kesalahan saat memvalidasi voucher.");
    }
  };




  const handlePayment = async () => {
    setIsProcessing(true);
    setVoucherError("");

    const validationError = validateParticipants();
    if (validationError) {
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: kode,
          voucher,
          additionalParticipants: participants,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.snap.pay(data.token)
      } else {
        alert(data.error || "Terjadi kesalahan saat memproses pembayaran.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };




  return (
    <div className={cn("relative w-full z-30 mx-auto max-w-[1100px]", className)}>
      <BannerTitle text={'Total Harga'} className={'translate-y-[95%] text-xl min-[380px]:text-[22px] md:text-5xl px-8 py-2 mx-auto z-50'} strokeClassName={'px-8 py-2'} color="red" />
      <BluePanel className="w-full flex items-start justify-center relative sm:px-10 xl:px-7 py-6 sm:py-10">
        {/* <div className="bg-[#F5DFB9] px-7 sm:px-10 xl:px-7 py-6 sm:py-10 w-full h-full rounded-[38px] sm:rounded-[48px] shadow-[0px_3px_10.3px_#474135,inset_0px_-13px_16.2px_#BC9D7F] relative"> */}
        <div className="mx-auto max-w-[700px] flex flex-col gap-4 sm:gap-5 justify-center items-center py-7 sm:py-8 px-3 md:px-0">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-medium text-justify">
            <span className="text-[#FF7DA7] font-semibold">Paket {name}</span> berisi : {desc}
          </div>
          {
            name == "Dewekan" && (
              <form className="w-full" onSubmit={handleVoucherSubmit}>
                <label className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">Masukkan Voucher (Opsional)</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  <BubbleInput
                    type={2}
                    inputType="text"
                    value={voucher}
                    onChange={handleVoucherChange}
                    className="h-[45px] sm:h-[80px]"
                    placeholder="Kode voucher"
                    inputClassName='text-base sm:text-xl text-[#591D6A] placeholder:text-[rgba(89,29,106,.5)]'
                  />
                  <div className="w-[60px] sm:w-[90px] h-[45px] sm:h-[80px] p-[3px] sm:p-[5px] sm:rounded-tr-3xl sm:rounded-bl-3xl rounded-tr-xl rounded-bl-xl shadow-lg bg-[linear-gradient(180deg,#241876_0%,#A93AAE_100%)] relative">
                    <button type="submit" className="w-full h-full bg-gradient-to-b from-[#F6D6FF] from-[43%] to-[#EFB3FF] to-[63%] sm:rounded-tr-2xl sm:rounded-bl-2xl rounded-tr-lg rounded-bl-lg overflow-hidden flex items-center justify-center">
                      <svg className="w-4 sm:w-8" viewBox="0 0 43 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.79297 8.15063C-1.52763 4.71108 2.09817 -0.848966 6.58496 0.802002L38.8965 12.6917C42.8375 14.1419 42.8202 19.7222 38.8701 21.1477L6.75098 32.7375C2.24618 34.3628 -1.34275 28.7609 2.0166 25.3479L7.89258 19.3792C9.22418 18.0264 9.23443 15.8591 7.91602 14.4934L1.79297 8.15063Z" fill="#591D6A" stroke="#000A62" />
                      </svg>
                    </button>
                  </div>
                </div>
                {voucherError && <div className="text-red-500 text-[10px] sm:text-base mt-2">{voucherError}</div>}
              </form>
            )
          }
          <div className="w-full text-white text-xs sm:text-sm md:text-base lg:text-lg">
            <div className="w-full flex justify-between">
              <div className="">Paket {name}</div>
              <div className="">Rp{formatCurrency(price)}</div>
            </div>
            {
              name == "Dewekan" && (
                <div className="w-full flex justify-between mt-2">
                  <div className="">Potongan Voucher</div>
                  <div className="">Rp{formatCurrency(discount)}</div>
                </div>
              )
            }
            <div className="w-full flex justify-between mt-6">
              <div className="font-extrabold">Total Bayar</div>
              <div className="font-extrabold text-[#FF7DA7]">Rp{formatCurrency(price - discount)}</div>
            </div>
          </div>
          {validateParticipants() && <div className="text-red-500 text-[10px] sm:text-base">{validateParticipants()}</div>}
          <div className="w-full">
            {
              isProcessing ? (
                <BubbleButton
                  scale={2}
                  color="pink"
                  className="text-xl sm:text-3xl py-4 min-w-36 mx-auto md:min-w-full"
                  onClick={() => { }}
                >
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-slate-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                </BubbleButton>
              ) : (
                <BubbleButton
                  scale={2}
                  color="pink"
                  className="text-xl sm:text-3xl py-4 min-w-36 mx-auto md:min-w-full"
                  onClick={handlePayment}
                >
                  Bayar Sekarang!
                </BubbleButton>
              )
            }
          </div>
        </div>
        {/* </div> */}
      </BluePanel>
    </div>
  );
}
