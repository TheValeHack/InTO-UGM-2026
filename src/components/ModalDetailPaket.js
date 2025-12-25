import Modal from "./Modal"

export default function ModalDetailPaket({ className, state, setState, packageName, participants }) {
    return (
        <Modal title={'Detail Paket'} className={className} state={state} setState={setState}>
            <div className="flex flex-col gap-2 sm:gap-3 w-full justify-center px-2 md:px-0 -translate-x-2 md:-translate-x-0">
                <div className="w-full flex justify-between">
                    <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Paket Aktif</div>
                    <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">Paket {packageName}</div>
                </div>
                <div className="text-[10px] sm:text-sm font-medium text-[#591D6A] text-center">
                    <span className="font-bold">Harap diperhatikan</span>, jika ada kesalahan dalam penulisan E-Mail dapat menghubungi Contact Person :
                    Miftah (<span className="font-bold cursor-pointer hover:text-[#3c1147]" onClick={() => window.open("https://wa.me/62881080637374", "_blank")}>+62881080637374</span>) / Steven (<span className="font-bold cursor-pointer hover:text-[#874e28]" onClick={() => window.open("https://wa.me/6287753285015", "_blank")}>+6287753285015</span>)
                </div>
                <div className="w-full h-[1px] bg-[#591D6A]"></div>
                {
                    participants?.map((item, i) => {
                        return (
                            <div key={i} className="w-full flex justify-between items-start">
                                <div className="text-[10px] sm:text-sm font-bold text-[#591D6A]">Peserta {i + 1}</div>
                                <div className="flex flex-col items-end">
                                    <div className="text-[10px] sm:text-sm font-medium text-[#591D6A]">{item?.name}</div>
                                    <div className="text-[10px] sm:text-sm font-semibold text-[#591D6A]">{item?.email}</div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </Modal>
    )
}