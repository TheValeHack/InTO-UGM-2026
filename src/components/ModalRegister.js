"use client";

import { useState } from "react";
import Modal from "./Modal";
import BubbleButton from "./BubbleButton";
import BubbleInput from "./BubbleInput";
import Image from "next/image";
import axios from "axios";
import ModalEventDetail from "./ModalEventDetail";

export default function ModalRegister({ className, state, setState, setLoginState }) {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+62|0)[2-9][0-9]{7,12}$/;

    const cleanedPhone = formData.phone.replace(/\s+/g, '');

    if (
      formData.name === "" ||
      formData.school === "" ||
      cleanedPhone === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.passwordConfirmation === ""
    ) {
      setIsLoading(false);
      setError("Semua data harus diisi!");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setIsLoading(false);
      setError("Email tidak valid.");
      return;
    }

    if (formData.password.length < 8) {
      setIsLoading(false);
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!phoneRegex.test(cleanedPhone)) {
      setIsLoading(false);
      setError("Masukkan nomor telepon yang valid (contoh: 081234567890 / +6281234567890).");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setIsLoading(false);
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        ...formData,
        phone: cleanedPhone,
      });
      setIsLoading(false);
      setFormData({
        name: "",
        school: "",
        phone: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      });
      setModalSuccess(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error.response);
      setError(error.response?.data?.error || "Terjadi error.");
    }
  };


  const handleClose = () => {
    setError(null)
    setFormData({
      name: "",
      school: "",
      phone: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    })
    setState(!state)
  }

  const handleSuccessClose = () => {
    handleClose()
    setLoginState(true)
    setModalSuccess(false)
  }

  return (
    <>
      <Modal customClose={handleClose} showScrollbar={true} title={"Registrasi"} state={state} setState={setState} className={className} bannerTitleClassName="translate-y-[25%] translate-x-[27%] md:translate-x-[40%]">
        <div className="flex flex-col sm:gap-3 w-full justify-center">
          <div className="w-full">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">Nama</label>
            <BubbleInput
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="w-full mt-2 sm:mt-0">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">Asal Sekolah</label>
            <BubbleInput
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="w-full mt-2 sm:mt-0">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">No. WhatsApp / No. Telepon</label>
            <BubbleInput
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="w-full mt-2 sm:mt-0">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">Email Aktif</label>
            <BubbleInput
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="w-full mt-2 sm:mt-0">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">Password</label>
            <BubbleInput
              inputType="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="w-full mt-2 sm:mt-0">
            <label className="text-[10px] sm:text-sm text-[#591D6A]">Konfirmasi Password</label>
            <BubbleInput
              inputType="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputClassName={"sm:py-3"}
            />
          </div>
          <div className="text-[10px] sm:text-sm text-[#591D6A] mt-2 sm:mt-0">
            Kamu sudah punya akun yaa? Ayo{" "}
            <span
              className="text-[#591D6A] hover:text-[#3c1147] font-semibold cursor-pointer"
              onClick={() => {
                setIsLoading(false)
                setError(null)
                setFormData({
                  name: "",
                  school: "",
                  phone: "",
                  email: "",
                  password: "",
                  passwordConfirmation: "",
                })
                setState(false);
                setLoginState(true);
              }}
            >
              Login
            </span>{" "}
            sekarang!
          </div>
          {error && <p className="text-red-500 text-[10px] sm:text-sm">{error}</p>}
          <div className="w-full flex justify-between gap-4 mt-1 sm:mt-0">
            <BubbleButton
              onClick={handleClose}
              scale={2}
              color="pink"
              className={"flex-1 text-lg sm:text-2xl py-1 md:py-5 min-w-20 md:min-w-fit"}
            >
              Cancel
            </BubbleButton>
            {
              isLoading ? (
                <BubbleButton
                  scale={2}
                  color="default"
                  className={"flex-1 text-lg sm:text-2xl py-1 md:py-5 min-w-20 md:min-w-fit"}
                >
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-slate-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                </BubbleButton>
              ) : (
                <BubbleButton
                  scale={2}
                  color="default"
                  className={"flex-1 text-lg sm:text-2xl py-1 md:py-5 min-w-20 md:min-w-fit"}
                  onClick={handleRegister}
                >
                  Regist
                </BubbleButton>
              )
            }
          </div>
        </div>
      </Modal>
      <ModalEventDetail noMinHeight={true} customClose={handleSuccessClose} customTitle={'SUKSES'} state={modalSuccess} setState={setModalSuccess} title1={'REGISTRASI'} title2={'SUKSES'} content={'Registrasi sukses! Silahkan cek email anda untuk memverifikasi email sebelum login. Silahkan cek bagian spam jika email tidak muncul di bagian utama.'} />
    </>

  );
}
