import cn from "@/utils/cn";

export default function BubbleButton({ children, className, onClick, scale = 1, color = 'default', disabled = false }) {
    const bgImages = {
        default: {
            1: "bg-[url('/images/btn_small_default.png')]",
            2: "bg-[url('/images/btn_standard_default.png')]",
            3: "bg-[url('/images/btn_medium_default.png')]",
            4: "bg-[url('/images/btn_large_default.png')]",
        },
        pink: {
            1: "bg-[url('/images/btn_small_pink.png')]",
            2: "bg-[url('/images/btn_medium_pink.png')]",
            3: "bg-[url('/images/btn_standard_pink.png')]",
            4: "bg-[url('/images/btn_large_pink.png')]",
        },
        brown: {
            1: "bg-[url('/images/btn_small_brown.png')]",
            2: "bg-[url('/images/btn_small_brown.png')]", // Defaulting to small if large doesn't exist
            3: "bg-[url('/images/btn_small_brown.png')]",
        },
        green: {
            1: "bg-[url('/images/btn_small_green.png')]",
            2: "bg-[url('/images/btn_large_green.png')]",
            3: "bg-[url('/images/btn_large_green.png')]",
        }
    };

    const minWidths = {
        1: "min-w-24",
        2: "min-w-52",
        3: "min-w-64",
    };

    return <div
        onClick={!disabled ? onClick : undefined}
        className={cn(
            "w-min text-center font-hentEunoyalk py-3 bg-center bg-no-repeat bg-contain flex items-center justify-center drop-shadow-[0_4px_5px_rgba(0,0,0,0.25)] relative transition-all",
            !disabled ? "cursor-pointer hover:translate-y-1" : "cursor-default pointer-events-none",
            minWidths[scale] || "min-w-24",
            bgImages[color]?.[scale] || bgImages.default[scale] || bgImages.default[1],
            className)}
    >
        <div className="button-text-shadow bg-[#FAFAFA] text-transparent z-10 translate-y-[-2px]">
            {children}
        </div>
    </div>
}
