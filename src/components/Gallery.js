import cn from "@/utils/cn";
import Image from "next/image";

export default function Gallery({className, images = []}){
    return (
        <div className={cn("w-full md:w-[70%] max-w-[800px] h-[400px] flex justify-center items-stretch gap-2 md:gap-5 transition-all duration-400 box-border", className)}>
            {
                images.map((img, i) => (
                    <div key={i} className="flex items-center justify-center flex-1 h-full transition-all duration-400 cursor-pointer box-border hover:flex-[3] grayscale hover:grayscale-0 odd:translate-y-[-20px] even:translate-y-[20px]">
                        <Image 
                            src={img.src}
                            width={1000}
                            height={1000}
                            alt="card"
                            className="block w-full h-full object-cover drop-shadow-xl"
                        />
                        <div className="absolute font-bold  items-center justify-center opacity-100 flex hover:opacity-0 w-full h-full">
                            <div className="text-white text-lg sm:text-2xl">{img.tag}</div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}