import cn from "@/utils/cn";
import BubbleButton from "./BubbleButton";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Paket({ className, name, price, desc, onClick }) {
    return (
        <div className={cn("w-full bg-[#B449D1] shadow-[0px_8px_0px_0px_#591D6A] rounded-3xl md:rounded-[52px] px-4 py-4 md:py-6 md:px-7 flex flex-col md:flex-row justify-between gap-3 md:gap-8 cursor-pointer transition-all duration-400 hover:scale-[1.02]", className)}>
            <div className="flex flex-col">
                <div className="text-3xl font-hentEunoyalk paket-title text-[#F6D6FF]">
                    {name}
                </div>
                <div className="md:hidden text-[#F6D6FF] font-hentEunoyalk text-2xl md:text-3xl ">
                    Rp{formatCurrency(price)}
                </div>
                <div className="text-xs md:text-sm mt-1 md:mt-3 text-[#F6D6FF]">
                    {desc}
                </div>
            </div>
            <div className="flex flex-col gap-1 items-center md:items-end justify-center">
                <div className="hidden md:block text-[#F6D6FF] text-3xl font-hentEunoyalk paket-price">
                    Rp{formatCurrency(price)}
                </div>
                <BubbleButton onClick={onClick} scale={1} color="default" className={'text-lg mt-3 hidden w-full md:flex'}>Beli</BubbleButton>
                <BubbleButton onClick={onClick} scale={3} color="default" className={'text-lg min-w-full flex md:hidden'}>Beli</BubbleButton>
            </div>
        </div>
    )
}