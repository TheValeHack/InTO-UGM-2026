export default function GradientTitle({ title1, title2 }) {
    return (
        <div className="flex flex-col items-center">
            <span className="relative inline-block font-extrabold text-4xl md:text-6xl font-hentEunoyalk">
                <span
                    className="absolute inset-0
                    text-black
                    [-webkit-text-stroke:3px_#591D6A]
                    select-none tracking-wide">
                    {title1}
                </span>

                <span
                    className="relative bg-gradient-to-b
                    from-[#F6D6FF] from-[10%]
                    to-[#EFB3FF] to-[37%]
                    bg-clip-text text-transparent tracking-wide button-text-shadow">
                    {title1}
                </span>
            </span>
            <span className="relative inline-block font-extrabold text-4xl md:text-6xl font-hentEunoyalk">
                <span
                    className="absolute inset-0
                    text-black
                    [-webkit-text-stroke:3px_#000A62]
                    select-none tracking-wide">
                    {title2}
                </span>

                <span
                    className="relative bg-gradient-to-b
                    from-[#D3D7FF] from-[60%]
                    to-[#6A79FF] to-[100%]
                    bg-clip-text text-transparent tracking-wide button-text-shadow">
                    {title2}
                </span>
            </span>
        </div>
    )
}