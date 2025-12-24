import cn from "@/utils/cn"
import Image from "next/image"
import BluePanel from "./BluePanel"
import BubbleButton from "./BubbleButton"

export default function Testimoni({ className, photo, name, testi, major, title }) {
    return (
        <BluePanel type={3} className={cn("w-full h-full px-12 md:px-[70px] pb-[32px] sm:pb-[45px] pt-14 md:pt-16 flex items-start justify-center relative", className)}>
            <div className="w-full h-full relative">
                <div className="w-full">
                    <div className="w-full h-full relative">
                        <Image
                            src={photo}
                            width={1000}
                            height={1000}
                            alt="gambar peserta"
                            className="w-[90%] md:w-[95%] object-contain mx-auto"
                        />
                        <BubbleButton disabled={true} scale={3} color="pink" className={'text-xl md:text-2xl min-w-44 md:min-w-64 py-6 md:py-3 mx-auto -rotate-6 -translate-y-14'}>{major}</BubbleButton>
                    </div>
                </div>
                <div className="w-full h-full -translate-y-12 md:-translate-y-7">
                    <div className="text-center w-full font-hentEunoyalk relative inline-block mx-auto text-4xl xl:text-5xl">
                        <span
                            className="absolute inset-0
                            text-black
                            [-webkit-text-stroke:3px_#000A62]
                            select-none tracking-wide">
                            {name}
                        </span>

                        <span
                            className="relative bg-gradient-to-b
                            from-[#D3D7FF] from-[60%]
                            to-[#6A79FF] to-[100%]
                            bg-clip-text text-transparent tracking-wide button-text-shadow">
                            {name}
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base font-medium mt-4 text-justify text-white">
                        {testi}
                    </div>
                </div>
            </div>
        </BluePanel>
    )
}