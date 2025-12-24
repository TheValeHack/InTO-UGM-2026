import Modal from "./Modal"
import BubbleButton from "./BubbleButton"

export default function ModalEvent({ state, setState, children }) {
    return (
        <Modal state={state} setState={setState} title={'Main Event'} bannerTitleClassName="translate-y-[3%] translate-x-[20%] md:translate-x-[35%]">
            <div className="w-full flex flex-col items-center justify-center">
                <div className={"text-[#591D6A] relative text-center font-hentEunoyalk text-xl md:text-3xl"}>
                    Ada Apa di InTO UGM 2026
                </div>
            </div>
            <div className="text-justify text-xs md:text-base mt-3 sm:mt-3 text-[#591D6A] px-3 md:px-0">
                Siap jadi bagian dari Universitas Gadjah Mada? Into UGM 2026 hadir dengan rangkaian kegiatan lengkap untuk membantu Sobat InTO mewujudkan mimpi masuk kampus impian!
            </div>
            <div className="flex flex-col gap-2 sm:gap-1 w-full mt-4 sm:mt-3 px-3 md:px-0">
                {children}
            </div>
        </Modal>
    )
}