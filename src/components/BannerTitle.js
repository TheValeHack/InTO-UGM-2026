import cn from "@/utils/cn";

export default function BannerTitle({ text, className, textClassName, color = "default" }) {
    return (
        <div className={cn(color == "red" ? "bg-[url('/images/title-red.png')]" : "bg-[url('/images/title.png')]", "bg-center bg-[length:100%_100%] px-16 py-2 text-center font-hentEunoyalk flex items-center justify-center relative w-fit", className)}>
            {
                color == "red" ? (
                    <span className="relative inline-block">
                        <span
                            className="absolute inset-0 -translate-x-[2px] text-black/75 select-none">
                            {text}
                        </span>

                        <span
                            className="relative bg-gradient-to-b from-white from-[60%] to-[#F99DBB]
                                bg-clip-text text-transparent">
                            {text}
                        </span>
                    </span>
                ) : (
                    <div className={cn("text-[#591D6A] relative", textClassName)}>
                        {text}
                    </div>
                )
            }
        </div>
    )
}