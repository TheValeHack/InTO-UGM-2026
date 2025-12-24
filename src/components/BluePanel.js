import cn from "@/utils/cn";

export default function BluePanel({ className, children, type = 1 }) {
    const bgClasses = {
        1: "bg-[url('/images/panel_blue_large.png')] md:bg-[url('/images/panel_blue_small.png')]",
        2: "bg-[url('/images/panel_blue_standard.png')]",
        3: "bg-[url('/images/panel_blue_large.png')]"
    };

    return (
        <div className={cn(
            "bg-no-repeat bg-center bg-[length:100%_100%] px-8 md:px-24 py-16 md:py-16 relative text-justify drop-shadow-2xl",
            className,
            bgClasses[type] || bgClasses[1]
        )}>
            {children}
        </div>
    )
}