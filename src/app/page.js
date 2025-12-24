"use client"

import BannerTitle from "@/components/BannerTitle";
import BubbleButton from "@/components/BubbleButton";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Gallery from "@/components/Gallery";
import Panel from "@/components/Panel";
import Paket from "@/components/Paket";
import testiData from '@/data/testimoni.json';
import eventData from '@/data/event.json';
import Testimoni from "@/components/Testimoni";
import Footer from "@/components/Footer";
import { useRouter, usePathname } from "next/navigation";
import Modal from "@/components/Modal";
import ModalEvent from "@/components/ModalEvent";
import ModalEventDetail from "@/components/ModalEventDetail";
import { useSession } from "next-auth/react";
import ModalGuest from "@/components/ModalGuest";
import BluePanel from "@/components/BluePanel";
import Butterfly from "@/components/Butterfly";

export default function Home() {
  const router = useRouter();
  const shipRef = useRef(null);
  const [modalGuest, setModalGuest] = useState(true)
  const [modalEvent, setModalEvent] = useState(false)
  const [modalEventDetail1, setModalEventDetail1] = useState(false)
  const [modalEventDetail2, setModalEventDetail2] = useState(false)
  const [modalEventDetail3, setModalEventDetail3] = useState(false)
  const [modalLogin, setModalLogin] = useState(false);

  const [paketData, setPaketData] = useState([]);
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (pathname === "/" && window.location.hash === "#event") {
        const section = document.getElementById("event");
        if (section) {
          const sectionPosition = section.offsetTop;
          window.scrollTo({
            top: sectionPosition,
            behavior: "smooth",
          });
        }
      }
      if (pathname === "/" && window.location.hash === "#paket") {
        const section = document.getElementById("paket");
        if (section) {
          const sectionPosition = section.offsetTop;
          window.scrollTo({
            top: sectionPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchPaketData() {
      try {
        const response = await fetch("/api/all_packages");
        if (response.ok) {
          const data = await response.json();
          setPaketData(data.packages);
        } else {
          console.error("Failed to fetch paket data");
        }
      } catch (error) {
        console.error("Error fetching paket data:", error);
      }
    }

    fetchPaketData();
  }, []);

  const event1 = eventData.find(item => item.id.toLowerCase() == "try_out")
  const event2 = eventData.find(item => item.id.toLowerCase() == "university_fair")
  const event3 = eventData.find(item => item.id.toLowerCase() == "talkshow_inspiratif")

  return (
    isLoading ? <></> :
      <div className="w-full overflow-hidden relative">
        {/* <ModalGuest state={modalGuest} setState={setModalGuest} /> */}
        <ModalEvent state={modalEvent} setState={setModalEvent}>
          <BubbleButton color="default" onClick={() => setModalEventDetail1(!modalEventDetail1)} scale={4} className={'text-lg sm:text-3xl min-w-full py-1 md:py-4'}>Try Out</BubbleButton>
          <BubbleButton color="pink" onClick={() => setModalEventDetail2(!modalEventDetail2)} scale={4} className={'text-lg sm:text-3xl min-w-full py-1 md:py-4'}>University Fair</BubbleButton>
          <BubbleButton color="green" onClick={() => setModalEventDetail3(!modalEventDetail3)} scale={3} className={'text-lg sm:text-3xl min-w-full py-1 md:py-4'}>Talkshow Inspiratif</BubbleButton>
        </ModalEvent>

        <ModalEventDetail state={modalEventDetail1} setState={setModalEventDetail1} title={event1.title} content={event1.content} />
        <ModalEventDetail state={modalEventDetail2} setState={setModalEventDetail2} title={event2.title} content={event2.content} />
        <ModalEventDetail state={modalEventDetail3} setState={setModalEventDetail3} title={event3.title} content={event3.content} />

        <Navbar className={'navbar'} session={session} modalLogin={modalLogin} setModalLogin={setModalLogin} />
        <Image
          src={'/images/bg-hero.png'}
          width={1000}
          height={1000}
          alt="bg hero"
          className="absolute w-full h-[125vh] sm:h-[120vh] lg:h-auto object-cover z-[-1] md:translate-y-[-8%]"
        />
        <div className="max-w-[2160px] mx-auto flex flex-col w-screen relative">
          <section id="hero" className="px-6 md:px-12 lg:px-16 w-full min-h-screen flex flex-col justify-center items-center relative">
            <Image src={'/images/title-hero.svg'} width={1000} height={1000} alt="hero title" className="w-72 md:w-[500px] animate-magical-hero" />
            <div className="flex flex-col gap-2 w-full md:w-fit mt-8 md:mt-0">
              <BubbleButton scale={1} color="default" className={'text-xl md:text-3xl min-w-full md:min-w-64 py-3 md:py-4'} onClick={() => { router.push("/#about"); }}>Jelajahi InTO</BubbleButton>
              {
                session?.user ? (
                  <BubbleButton scale={1} color="default" className={'text-xl md:text-3xl min-w-full md:min-w-64 py-3 md:py-4'} onClick={() => { router.push("/#paket"); }}>Beli Paket TO</BubbleButton>
                ) : (
                  <BubbleButton scale={1} color="default" className={'text-xl md:text-3xl min-w-full md:min-w-64 py-3 md:py-4'} onClick={() => setModalLogin(true)}>Login/Masuk</BubbleButton>
                )
              }
            </div>
          </section>
          <div className="translate-y-[-75px] z-40">
            <Image
              src={'/images/arrow_bottom.png'}
              width={1000}
              height={1000}
              className="w-8 md:w-10 mx-auto animate-bounce cursor-pointer z-30"
              alt="arrow bottom"
              onClick={() => {
                const section = document.getElementById("about");
                const sectionPosition = section.offsetTop;
                window.scrollTo({
                  top: sectionPosition,
                  behavior: "smooth",
                });
              }}
            />
          </div>
          <section id="about" className="w-full min-h-screen flex justify-center items-center relative">
            <Image
              src={'/images/lampion.svg'}
              width={1000}
              height={1000}
              alt="lampion"
              className="absolute top-0 left-0 z-20 w-32 md:w-56 -mt-10 md:-mt-0 lampion-animate"
            />
            <Image
              src={'/images/clover-right.png'}
              width={1000}
              height={1000}
              alt="lampion"
              className="absolute top-32 right-0 w-32 md:w-48"
            />
            <div className="px-6 md:px-12 lg:px-16 w-full h-full absolute top-0 left-0 overflow-hidden pointer-events-none">
              <Butterfly
                src={'/images/butterfly1.svg'}
                className="top-0 left-0"
                startPos={{ x: 100, y: 100 }}
              />
              <Butterfly
                src={'/images/butterfly3.svg'}
                className="top-0 left-0"
                startPos={{ x: 300, y: 250 }}
              />
            </div>
            <div className="px-6 md:px-12 lg:px-16 w-full">
              <div data-aos="fade-up" data-aos-duration="1000" className="relative w-full md:w-[75%] lg:min-w-[650px] lg:w-[50%] max-w-[680px] z-30 mx-auto">
                <BannerTitle text={'InTO UGM?'} className={'translate-y-[100%] mx-0 translate-x-[15%] md:translate-x-[25%] text-2xl w-fit md:text-5xl px-8 py-2 z-20'} textClassName={'text-[#591D6A]'} />
                <Panel className={'text-sm md:text-base text-[#591D6A]'}>
                  <Image src={'/images/logo-2026.png'} width={100} height={100} alt="logo" className="w-32 md:w-36 mx-auto mb-6" />
                  Berangkat dari semangat Tridharma Perguruan Tinggi Ikatan Keluarga Gadjah Mada Sumatera Selatan (IKAGAMASS UGM) yang ingin mengobarkan semangat talenta muda agar memperjuangkan impian menempuh pendidikan di tanah Bulaksumur. InTO UGM hadir sejak 2017 dan selalu memberikan informasi mengenai Perguruan Tinggi Negeri khususnya Universitas Gadjah Mada bagi Generasi Muda Sriwijaya. Bekal dan strategi mendalam mengenai proses dinamika seleksi masuk perguruan tinggi yang dikemas secara khusus untuk siswa-siswi SMA/SMK Sederajat di seluruh penjuru Sumatera bagian Selatan.
                </Panel>
              </div>
            </div>
            <Image
              src={'/images/lampion.svg'}
              width={1000}
              height={1000}
              alt="awan2"
              className="absolute bottom-0 right-0 z-20 w-32 md:w-56 -mb-16 md:-mb-0 lampion-animate"
            />
            <Image
              src={'/images/maple-clover-left.png'}
              width={1000}
              height={1000}
              alt="awan1"
              className="absolute bottom-0 translate-y-[25%] left-0 w-32 md:w-48"
            />
          </section>
          <section id="gallery" className="w-full min-h-screen md:min-h-[75vh] flex justify-center items-center relative">
            <Image
              src={'/images/maple-right.png'}
              width={1000}
              height={1000}
              alt="awan1"
              className="absolute top-32 right-0 w-32 md:w-48"
            />
            <div className="px-6 md:px-12 lg:px-16 w-full z-30">
              <Gallery className={'mx-auto'} images={[{ src: '/images/1.png', tag: 2020 }, { src: '/images/2.jpg', tag: 2022 }, { src: '/images/3.jpg', tag: 2023 }, { src: '/images/4.jpg', tag: 2024 }, { src: '/images/5.png', tag: 2025 }]} />
            </div>
            <Image
              src={'/images/clover-left.png'}
              width={1000}
              height={1000}
              alt="awan1"
              className="absolute bottom-0 translate-y-[35%] left-0 w-64 md:w-80 translate-x-[-35%] md:translate-x-0"
            />
          </section>
          <section id="event" className="w-full min-h-[70vh] md:min-h-screen flex flex-col justify-center items-center relative">
            <div className="flex justify-start gap-10 relative w-full px-6 md:px-12 lg:px-16">
              <div className="flex flex-col items-center md:items-end justify-center md:justify-end z-20 mb-8 mx-auto md:mx-0 md:translate-x-[75%] relative">
                <Image
                  src={'/images/bridge.png'}
                  width={1000}
                  height={1}
                  alt="kapal"
                  className="flex absolute md:hidden w-[40%] cursor-pointer top-0 z-[-2] translate-y-[-80%] translate-x-[50%]"
                />
                <BannerTitle text={'Rangkaian Kegiatan'} className={'text-2xl md:text-5xl px-8 py-2'} strokeClassName={'px-8 py-2'} />
                <div className="translate-y-[-40%] md:translate-y-[-28%] md:translate-x-[20%] flex items-end justify-end relative">
                  <BubbleButton onClick={() => setModalEvent(!modalEvent)} scale={3} color="default" className={'text-sm md:text-2xl min-w-36 md:min-w-64 py-6 md:py-6'}>Ada Apa di Main Event?</BubbleButton>
                  <Image
                    src={'/images/click.svg'}
                    width={1000}
                    height={1000}
                    alt="click"
                    className="absolute w-8 sm:w-9 translate-y-[25%] click"
                  />
                </div>
              </div>
            </div>
            <div className="relative w-full flex flex-col items-start">
              <Image
                src={'/images/events-desktop.png'}
                width={1000}
                height={1}
                alt="kapal"
                className="hidden md:flex w-[55%] cursor-pointer translate-x-[25%]"
              />
              <Image
                src={'/images/events-mobile.png'}
                width={1000}
                height={1}
                alt="kapal"
                className="flex md:hidden w-full cursor-pointer translate-y-[-20%]"
              />
              <Image
                src={'/images/bridge.png'}
                width={1000}
                height={1}
                alt="kapal"
                className="hidden absolute md:flex w-[25%] cursor-pointer right-0 z-[-2] translate-y-[-20%]"
              />
              <Image
                src={'/images/background-tirai.png'}
                width={2000}
                height={1000}
                alt="tirai"
                className="w-screen absolute left-1/2 -translate-x-1/2 top-full -mt-[7%] z-[-1] pointer-events-none"
              />
            </div>
          </section>
          <section id="paket" className="w-full min-h-[75vh] flex flex-col justify-center items-center relative py-12 md:py-20">
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <Butterfly
                src={'/images/butterfly2.svg'}
                className="top-0 left-0"
                startPos={{ x: 500, y: 150 }}
              />
              <Butterfly
                src={'/images/butterfly3.svg'}
                className="top-0 left-0"
                startPos={{ x: 300, y: 250 }}
              />
              <div className="relative w-full md:w-[75%] lg:min-w-[650px] lg:w-[50%] max-w-[750px] z-30 mx-auto" data-aos="fade-up" data-aos-duration="1000">
                <Image
                  src={'/images/mushroom.png'}
                  width={1000}
                  height={1000}
                  alt="awan1"
                  className="absolute w-32 md:w-64 right-0 translate-y-[-45%] md:translate-y-[-55%]"
                />
                <Image
                  src={'/images/flower.png'}
                  width={1000}
                  height={1000}
                  alt="awan1"
                  className="absolute w-40 md:w-60 bottom-0 left-0 z-10 translate-y-[30%] md:translate-y-[35%] translate-x-[-30%]"
                />
                <Panel type={2} className={'px-12 md:px-6 md:pl-24 md:pr-28 pb-28 md:pb-36 pt-20 md:pt-24 flex flex-col items-center justify-center gap-8'}>
                  <BannerTitle text={'Paket TO'} className={'text-2xl md:text-5xl px-8 py-2 mb-1 md:mb-8'} strokeClassName={'px-8 py-2'} />
                  {
                    paketData.map((paket, i) => (
                      <Paket key={i} name={paket.name == "Betigo" ? "Betigo (3 Orang)" : paket.name == "Belimo" ? "Belimo (5 Orang)" : paket.name} desc={paket.desc} price={paket.price} onClick={
                        () => {
                          if (session?.user) {
                            router.push(`/paket_${paket.name.toLowerCase()}`)
                          } else {
                            setModalLogin(true)
                          }
                        }
                      } />
                    ))
                  }
                </Panel>
              </div>
            </div>
          </section>
          <section id="testi" className="w-full min-h-[75vh] md:py-20 flex flex-col justify-center items-center relative">
            <div className="px-6 md:px-12 lg:px-16 py-24 w-full relative">
              <BannerTitle text={'Apa Kata Mereka?!'} className={'text-2xl md:text-5xl px-8 py-2 mx-auto'} strokeClassName={'px-8 py-2'} color="red" />
              <div className="mt-12 flex flex-col xl:flex-row justify-center items-center gap-9 lg:gap-5">
                {
                  testiData.map((testi, i) => {
                    return (
                      <div
                        key={i}
                        className="flex-1 max-w-[300px] sm:max-w-[420px] lg:h-[720px]"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                      >
                        <Testimoni
                          photo={testi.photo}
                          name={testi.name}
                          testi={testi.testi}
                          major={testi.major}
                          title={testi.title}
                          className={i === 1 ? 'order-first lg:order-none' : ''} />

                      </div>

                    )
                  })
                }
              </div>
            </div>
          </section>
          <section id="map" className="w-full min-h-[75vh] py-20 flex flex-col justify-start items-center relative">
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <div data-aos="fade-up" data-aos-duration="1000" className="relative w-full md:w-[80%] lg:min-w-[650px] max-w-[850px] z-30 mx-auto" >
                <BannerTitle text={'Lokasi Try Out'} className={'translate-y-[120%] md:translate-y-[100%] mx-0 translate-x-[15%] md:translate-x-[25%] text-2xl md:text-5xl px-8 py-2 z-20'} textClassName={'text-[#591D6A]'} />
                <Panel type={3} className={'px-11 md:px-14 pb-14 md:pb-28 pt-20 md:pt-32 flex flex-col items-center text-black'}>
                  <div className="w-full md:w-[80%] aspect-1 sm:h-[330px] border-[5px] md:border-[7px] border-[#591D6A] rounded-[35px] md:rounded-[50px] overflow-hidden">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3991.5609925883264!2d104.69919435145265!3d-2.916599296142193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b737f9d38bb21%3A0x879c802cb444f6a0!2sBima%20Sakti%20Convention%20Center!5e0!3m2!1sen!2sid!4v1735213966496!5m2!1sen!2sid" className="w-full h-full rounded-[30px] md:rounded-[43px]" allowFullScreen referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                  <div className="font-semibold text-[#591D6A] [text-shadow:none] mt-4 text-base sm:text-xl">Bima Sakti Convention Center</div>
                  <div className="font-medium text-[#591D6A] [text-shadow:none] mt-2 text-center text-sm sm:text-base md:text-lg lg:text-xl md:px-20">Jl. Adi Sucipto KM.11, Kebun Bunga, Kec. Sukarami, Kota Palembang, Sumatera Selatan 30961</div>
                  <BubbleButton onClick={() => {
                    window.open('https://maps.app.goo.gl/Jbo2C4nPhxH9mdMe6', '_blank')
                  }} scale={1} color="default" className={'text-xl md:text-2xl min-w-36 md:min-w-64 py-6 md:py-3 mt-2 md:mt-5'}>Google Maps</BubbleButton>
                </Panel>
              </div>
            </div>
          </section>
          <section id="partner" className="w-full min-h-[75vh] py-20 flex flex-col justify-center items-center relative">
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <Butterfly
                src={'/images/butterfly3.svg'}
                className="top-0 left-0"
                startPos={{ x: 300, y: 250 }}
              />
              <div data-aos="fade-up" data-aos-duration="1000" className="relative w-full lg:w-[80%] lg:min-w-[650px] max-w-[880px] z-30 mx-auto">
                <BannerTitle text={'Berkolaborasi Bersama'} className={'translate-y-[120%] md:translate-y-[80%] text-2xl lg:text-5xl px-8 py-2 mx-auto z-50'} strokeClassName={'px-8 py-2'} color="red" />
                <BluePanel type={1} className="w-full p-3 px-12 pb-14 pt-16 lg:pb-[60px] flex items-start justify-center rounded-[60px] relative">
                  <div className="py-4 w-full h-full rounded-[48px] relative">
                    <div className="mx-auto max-w-[300px] sm:max-w-max flex flex-col lg:flex-row gap-1 md:gap-4 items-stretch ">
                      <div className="w-full sm:w-fit mx-auto relative flex flex-col justify-between items-center rounded-3xl">
                        <Image
                          src="/images/ruangguru-black.png"
                          width={1000}
                          height={1000}
                          alt="gambar logo"
                          className="w-[70%] md:w-[75%]"
                        />
                        <BubbleButton onClick={() => window.open('https://ruangguru.com', '_blank')} scale={3} color="pink" className={'text-xl md:text-2xl min-w-full md:min-w-64 py-6 md:py-3 mt-2 md:mt-5'}>Sponsor dan Partnership</BubbleButton>
                      </div>
                      <div className="flex-1 rounded-3xl font-medium text-sm lg:text-lg text-justify text-white flex items-center">
                        Ruangguru sebagai layanan bimbingan belajar nomor 1 di Indonesia penyedia akses pembelajaran berbasis teknologi, termasuk kelas virtual, platform ujian online, video belajar pembelajaran, marketplace les private, dan lainnya. Sejak 2014 kualitas soal yang telah dipercaya oleh 22.000.000 pengguna tentu dapat mendukung Sobat InTO dalam memperjuangkan PTN impian!
                      </div>
                    </div>
                  </div>
                </BluePanel>
              </div>
            </div>
          </section>
          <section id="brand" className="w-full min-h-[75vh] py-20 flex justify-center items-center relative">
            <Butterfly
              src={'/images/butterfly1.svg'}
              className="top-0 left-0"
              startPos={{ x: 300, y: 250 }}
            />
            <div className="px-6 md:px-12 lg:px-16 w-full relative flex justify-center items-center h-full">
              <span className="relative inline-block text-4xl md:text-6xl font-hentEunoyalk text-center">
                <span
                  className="absolute inset-0
                        text-black
                        [-webkit-text-stroke:2px_#000A62]
                        select-none tracking-wide">
                  Pelita Eksplorasi Jenggala
                </span>

                <span
                  className="relative bg-gradient-to-r
                        from-[#F99DBB]
                        via-white via-[62%]
                        to-[#F99DBB]
                        bg-clip-text text-transparent tracking-wide button-text-shadow">
                  Pelita Eksplorasi Jenggala
                </span>
              </span>
            </div>
          </section>
          <section id="footer">
            <Footer />
          </section>
        </div>
      </div>
  );
}
