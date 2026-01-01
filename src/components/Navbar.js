"use client";

import Image from "next/image";
import BubbleButton from "./BubbleButton";
import { useRouter, usePathname } from "next/navigation";
import cn from "@/utils/cn";
import { useEffect, useState } from "react";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";
import ModalProfile from "./ModalProfile";
import BluePanel from "./BluePanel";

export default function Navbar({ className, session, modalLogin, setModalLogin }) {
  const [modalRegister, setModalRegister] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();
  const path = usePathname()

  return (
    <div className={cn("w-screen fixed flex justify-between top-0 bg-red z-[999]", className)}>
      <ModalLogin state={modalLogin} setState={setModalLogin} setRegisterState={setModalRegister} />
      <ModalRegister state={modalRegister} setState={setModalRegister} setLoginState={setModalLogin} />
      {session?.user && (<ModalProfile session={session} state={modalProfile} setState={setModalProfile} />)}

      <div>
        <div className="bg-[#F6D6FF] h-16 md:h-24 z-20 flex items-center rounded-br-[40px] border-[5px] border-l-0 border-[color:#591D6A]">
          <div className="w-full h-full bg-[#F6D6FF] z-40 rounded-br-[35px] px-4 justify-center md:px-6 flex items-center">
            <Image
              src={"/images/logo-2026.png"}
              width={1000}
              height={1000}
              alt="logo"
              unoptimized
              className="w-12 md:w-20 z-40 cursor-pointer translate-x-[-8px] md:translate-x-0"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center z-10 w-screen absolute border-t-[5px] border-b-[5px] border-[color:#591D6A] bg-[#F6D6FF] py-0 md:py-2">
        <div className="w-[0px] h-10 md:h-fit opacity-0 overflow-hidden lg:w-auto lg:opacity-100 flex gap-2">
          <BubbleButton
            scale={1}
            color="green"
            className={"text-xl"}
            onClick={() => {
              router.push("/#paket");
            }}
          >
            Paket TO
          </BubbleButton>
          <BubbleButton
            scale={1}
            color="pink"
            className={"text-xl"}
            onClick={() => {
              router.push("/#event");
            }}
          >
            Acara
          </BubbleButton>
          {session?.user ? (
            <BubbleButton
              scale={1}
              color="brown"
              className={"text-xl"}
              onClick={() => {
                setModalProfile(!modalProfile)
              }}
            >
              Profile
            </BubbleButton>
          ) : (
            <BubbleButton
              scale={1}
              color="brown"
              className={"text-xl"}
              onClick={() => {
                setModalRegister(!modalRegister);
              }}
            >
              Daftar
            </BubbleButton>
          )}
        </div>
      </div>

      <div>
        <div className="bg-[#F6D6FF] h-16 md:h-24 z-20 flex items-center rounded-bl-[40px] border-[5px] border-r-0 border-[color:#591D6A]">
          <div className="w-full h-full bg-[#F6D6FF] z-40 rounded-bl-[35px] px-4 flex items-center relative">
            {session?.user ? (
              <div>
                <BubbleButton
                  scale={2}
                  color="default"
                  className={"text-base hidden lg:block md:text-2xl min-w-28 md:min-h-12 md:min-w-36 translate-x-2 md:translate-x-0"}
                  onClick={() => {
                    setModalProfile(!modalProfile)
                  }}
                >
                  {session.user.name.length > 12
                    ? `${session.user.name.slice(0, 12)}...`
                    : session.user.name}
                </BubbleButton>
                <BubbleButton
                  scale={2}
                  color="default"
                  className={"text-base block lg:hidden md:text-2xl min-w-28 md:min-h-12 md:min-w-36 translate-x-2 md:translate-x-0"}
                  onClick={() => setDropdown(!dropdown)}
                >
                  {session.user.name.length > 12
                    ? `${session.user.name.slice(0, 12)}...`
                    : session.user.name}
                </BubbleButton>
                <div style={{
                  display: dropdown ? "flex" : "none"
                }} className="absolute lg:h-[0px] lg:overflow-hidden lg:w-[0px] p-1 pb-2 lg:p-0 -translate-y-1 -translate-x-2">
                  <BluePanel type={3} className="flex flex-col gap-[2px] px-6 py-6">
                    <BubbleButton
                      scale={1}
                      color="green"
                      className={"text-base md:text-xl w-fit"}
                      onClick={() => {
                        router.push("/#event");
                      }}
                    >
                      Paket TO
                    </BubbleButton>
                    <BubbleButton
                      scale={1}
                      color="pink"
                      className={"text-base md:text-xl w-fit"}
                      onClick={() => {
                        router.push("/#paket");
                      }}
                    >
                      Acara
                    </BubbleButton>
                    {session?.user ? (
                      <BubbleButton
                        scale={1}
                        color="brown"
                        className={"text-base md:text-xl w-fit"}
                        onClick={() => {
                          setModalProfile(!modalProfile)
                        }}
                      >
                        Profile
                      </BubbleButton>
                    ) : (
                      <BubbleButton
                        scale={1}
                        color="brown"
                        className={"text-base md:text-xl w-fit"}
                        onClick={() => {
                          setModalRegister(!modalRegister);
                        }}
                      >
                        Daftar
                      </BubbleButton>
                    )}
                  </BluePanel>
                </div>
              </div>
            ) : (
              <BubbleButton
                scale={1}
                color="default"
                className={"text-base md:text-2xl min-w-28 md:min-h-12 md:min-w-36 translate-x-2 md:translate-x-0"}
                onClick={() => setModalLogin(!modalLogin)}
              >
                Login
              </BubbleButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
