
import Modal from "./Modal"

export default function ModalEventDetail({ className, title, content, state, setState, customTitle, customClose, noMinHeight }) {
    return (
        <Modal customClose={customClose} state={state} setState={setState} className={className} title={customTitle ? customTitle : 'Main Event'} noMinHeight={noMinHeight} bannerTitleClassName="translate-y-[3%] translate-x-[20%] md:translate-x-[35%]">
            <div className="w-full flex flex-col items-center justify-center">
                <div className={"text-[#591D6A] relative text-center font-hentEunoyalk text-3xl"}>
                    {title}
                </div>
            </div>
            <div className="text-justify text-xs md:text-base mt-3 sm:mt-3 text-[#591D6A] px-3 md:px-0">
                {(typeof content === "string") ? content : <ul className="list-disc">{content.map((c, i) => <li key={i}>{c}</li>)}</ul>}
            </div>
        </Modal>
    )
}