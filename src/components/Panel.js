import cn from "@/utils/cn";

export default function Panel({ className, children, type = 1 }) {
    const bgClasses = {
        1: "bg-[url('/images/panel_standard.png')] sm:bg-[url('/images/panel_smallest.png')]",
        2: "bg-[url('/images/panel_standard.png')] sm:bg-[url('/images/panel_standard.png')]",
        3: "bg-[url('/images/panel_standard.png')] sm:bg-[url('/images/panel_smaller.png')]"
    };

    return (
        <div className={cn(
            "bg-no-repeat bg-center bg-[length:100%_100%] px-12 md:px-24 py-16 md:py-16 relative text-justify drop-shadow-2xl",
            className,
            bgClasses[type] || bgClasses[1]
        )}>
            {children}
        </div>
    )
}