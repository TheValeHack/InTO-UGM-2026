"use client"

import { useState, useEffect } from "react";
import cn from "@/utils/cn";
import BannerTitle from "./BannerTitle";
import Panel from "./Panel";
import Image from "next/image";

export default function ModalGuest({ className, children, title, state, setState, showScrollbar = false, customClose, noMinHeight }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (state) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  return (
    isVisible && (
      <div
        className={cn(
          "w-screen h-screen fixed px-6 md:px-12 lg:px-16 bg-[rgba(0,0,0,0.8)] z-[999999] flex items-center justify-center transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0",
          className
        )}
      >
        <svg
          onClick={customClose ? customClose : () => setState(false)}
          className="w-10 absolute z-30 mt-4 mr-6 right-0 top-0 cursor-pointer drop-shadow-[0px_5px_8px_rgba(0,0,0,0.52)] transition-all hover:translate-y-[2px]" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M51.6918 10.1331C40.7118 -0.84338 22.8318 -0.84691 11.8518 10.1331C0.87184 21.1166 0.87537 38.9931 11.8518 49.9766C22.8318 60.9531 40.7083 60.9566 51.6918 49.9766C62.6754 38.9896 62.6718 21.1166 51.6918 10.1331ZM16.1895 45.639C7.58125 37.0343 7.57419 23.0401 16.1648 14.4496C24.7554 5.85544 38.7495 5.86603 47.3577 14.4707C55.9624 23.0754 55.966 37.0731 47.3789 45.6637C38.7812 54.2543 24.7907 54.2437 16.1895 45.639Z" fill="white" />
          <path fillRule="evenodd" clipRule="evenodd" d="M39.4023 40.8104C38.7599 40.8104 38.2764 40.5563 38.0329 40.3127L31.7964 34.0833L25.814 40.0657C25.5811 40.2986 25.0411 40.581 24.3211 40.581C23.7811 40.581 22.9658 40.4186 22.1929 39.6457C21.4129 38.8692 21.2399 38.0998 21.2364 37.5986C21.2223 36.9351 21.4799 36.4339 21.7305 36.1869L27.8152 30.0986L21.8858 24.1763C21.3493 23.6363 20.9011 21.9633 22.3093 20.5586C23.1035 19.7645 23.8835 19.5986 24.4023 19.5986C25.0482 19.5986 25.5317 19.8527 25.7682 20.0963L31.7964 26.1175L37.7823 20.1316C38.0223 19.8951 38.5587 19.6163 39.2787 19.6163C39.8223 19.6163 40.6376 19.7786 41.4105 20.5551C42.7446 21.8928 42.4764 23.4139 41.8729 24.0139L35.7811 30.1057L41.9117 36.2327C42.1482 36.4727 42.427 37.0092 42.427 37.7292C42.427 38.2727 42.2682 39.081 41.4917 39.8539C40.6976 40.6445 39.9211 40.8104 39.4023 40.8104Z" fill="white" />
        </svg>
        <div className="flex flex-col justify-center items-center">
          <Image
            width={1000}
            height={1000}
            src={'/images/guest_star_into2026.png'}
            alt="gues star siluet"
            className="w-72"
          />
          <div className="font-medium text-2xl text-white mt-6 text-center">Guest Star InTO UGM 2026!</div>
          <div className="font-bold text-2xl text-white text-center">Enrique Owen & Alwi Johan</div>
        </div>
      </div>
    )
  );
}
