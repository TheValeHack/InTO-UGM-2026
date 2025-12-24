import { useEffect, useState } from "react";
import Modal from "./Modal";
import BubbleButton from "./BubbleButton";
import { signOut } from "next-auth/react";
import ModalDetailPaket from "./ModalDetailPaket";

export default function ModalProfile({ className, state, setState, session }) {
  const [activePackage, setActivePackage] = useState(null);
  const [modalDetail, setModalDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state) {
      fetchActivePackage();
    }
  }, [state]);

  const fetchActivePackage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/active-package", {
        headers: {
          "user-id": session.user.id,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setActivePackage(null);
          return;
        }
        throw new Error(await response.text());
      }

      const data = await response.json();
      setActivePackage(data);
    } catch (err) {
      setError("Failed to fetch active package.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Modal title={"Profile"} state={state} setState={setState} className={className} panelClassName="min-h-fit">
        <div className="flex flex-col gap-2 sm:gap-3 w-full justify-center px-2 md:px-0 -translate-x-2 md:-translate-x-0">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between">
              <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Nama</div>
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">{session.user.name}</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Asal Sekolah</div>
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">{session.user.school}</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Email</div>
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">{session.user.email}</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Nomor Whatsapp</div>
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">{session.user.phone}</div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#591D6A]"></div>
          <div className="w-full flex justify-between">
            <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Paket Aktif</div>
            {loading ? (
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">Loading...</div>
            ) : error ? (
              <div className="text-[10px] sm:text-sm font-medium text-red-500">{error}</div>
            ) : activePackage ? (
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">
                Paket {activePackage.package.name}
              </div>
            ) : (
              <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">Tidak Ada</div>
            )}
          </div>

          <div className="w-full flex flex-col justify-center gap-1 sm:gap-3 mt-1 sm:mt-2">
            {
              activePackage ? (
                <BubbleButton scale={4} color="default" className={"text-lg sm:text-3xl min-w-full py-2 md:py-4"} onClick={() => {
                  setModalDetail(!modalDetail)
                }}>
                  Lihat Detail Paket
                </BubbleButton>
              ) : (
                <BubbleButton scale={4} color="default" className={"text-lg sm:text-3xl min-w-full py-2 md:py-4"} onClick={() => {
                  const section = document.getElementById("paket");
                  const sectionPosition = section.offsetTop;
                  window.scrollTo({
                    top: sectionPosition,
                    behavior: "smooth",
                  });
                  setState(false)
                }}>
                  Beli Paket Sekarang
                </BubbleButton>
              )
            }
            <BubbleButton
              onClick={() => {
                signOut({
                  callbackUrl: "/",
                });
              }}
              scale={4}
              color="pink"
              className={"text-lg sm:text-3xl min-w-full py-2 md:py-4"}
            >
              LogOut
            </BubbleButton>
          </div>
        </div>
      </Modal>
      <ModalDetailPaket state={modalDetail} setState={setModalDetail} packageName={activePackage?.package?.name} participants={activePackage?.participants} />
    </>
  );
}
