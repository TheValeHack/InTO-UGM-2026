import Image from "next/image"

export default function Footer() {
  return (
    <div id="footer" className="w-full min-h-[500px] sm:min-h-[650px] flex justify-center items-center relative bg-[url('/images/bg-footer-mobile.png')] sm:bg-[url('/images/bg-footer.png')] bg-[top_center] bg-[percentage:100%_100%] sm:bg-cover">
      <div className="px-6 md:px-12 lg:px-16 w-full relative flex flex-col gap-4 justify-center items-center h-full translate-y-[12%]">
        <Image
          src="/images/logo-2026-footer.png"
          width={1000}
          height={1000}
          className="w-36 md:w-72 -mb-6"
          alt="logo footer"
        />
        <div className="flex justify-center items-center">
          <a target="_blank" href="https://www.instagram.com/ikagamass_ugm/profilecard">
            <Image
              src="/images/instagram.png"
              width={1000}
              height={1000}
              alt="sosmed"
              className="w-7 md:w-9 cursor-pointer transition-all duration-400 hover:scale-[1.05]"
            />
          </a>
          <div className="mx-5 text-white">
            |
          </div>
          <a target="_blank" href="https://www.tiktok.com/@intougm?_t=ZS-8so3DAeXWpl&_r=1">
            <Image
              src="/images/tiktok.png"
              width={1000}
              height={1000}
              alt="sosmed"
              className="w-7 md:w-9 cursor-pointer transition-all duration-400 hover:scale-[1.05]"
            />
          </a>
          <div className="mx-5 text-white">
            |
          </div>
          <a target="_blank" href="https://x.com/into_ugm?s=21">
            <Image
              src="/images/x.png"
              width={1000}
              height={1000}
              alt="sosmed"
              className="w-7 md:w-9 cursor-pointer transition-all duration-400 hover:scale-[1.05]"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-white  text-xs md:text-base">intougm2026@gmail.com</div>
          <div className="text-white  text-xs md:text-base">Kamu punya pertanyaan? Hubungi :</div>
          <div className="text-white text-xs md:text-base cursor-pointer hover:text-slate-200" onClick={() => window.open("https://wa.me/62881080637374", "_blank")}>Miftah (+62881080637374)</div>
          <div className="text-white text-xs md:text-base cursor-pointer hover:text-slate-200" onClick={() => window.open("https://wa.me/6287753285015", "_blank")}>Steven (+6287753285015)</div>
        </div>
        <div className="text-white  text-xs md:text-base">Copyright @InTO UGM 2026</div>
      </div>
    </div>
  )
}