"use client";

import { useState } from "react";
import Modal from "./Modal";
import BubbleButton from "./BubbleButton";
import BubbleInput from "./BubbleInput";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function ModalLogin({ className, state, setState, setRegisterState }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true)

    if (formData.email == "" || formData.password == "") {
      setIsLoading(false)
      setError("Semua data harus diisi!")
      return
    }

    if (!emailRegex.test(formData.email)) {
      setIsLoading(false);
      setError("Email tidak valid.");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      setIsLoading(false)
      if (result.error) {
        setError(result.error.toLowerCase() == "configuration" ? "Email atau password salah." : result.error);
        return;
      }

      setState(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      setError("Terjadi error.");
    }
  };

  const handleClose = () => {
    setError(null)
    setFormData({
      email: "",
      password: "",
    })
    setState(!state)
  }

  return (
    <Modal title={"Login"} state={state} setState={setState} className={className} customClose={handleClose} panelClassName="min-h-fit">
      <div className="flex flex-col sm:gap-4 w-full justify-center px-1 md:px-0 -translate-x-1 md:-translate-x-0">
        {error && <p className="text-red-500 text-[10px] sm:text-sm">{error}</p>}
        <div className="w-full">
          <label className="text-[10px] sm:text-sm text-[#591D6A]">Username (E-mail)</label>
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
        <div className="text-[10px] sm:text-sm text-[#591D6A] mt-2 sm:mt-0">
          Kamu belum punya akun yaa? Ayo{" "}
          <span
            className="text-[#591D6A] hover:text-[#3c1147] font-semibold cursor-pointer"
            onClick={() => {
              setState(false);
              setIsLoading(false)
              setError(null)
              setFormData({
                email: "",
                password: ""
              })
              setState(false);
              setRegisterState(true);
            }}
          >
            Registrasi
          </span>{" "}
          sekarang!
        </div>
        <div className="w-full flex justify-between gap-4 mt-3 md:mt-0">
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
                onClick={handleLogin}
              >
                Login
              </BubbleButton>
            )
          }
        </div>
      </div>
    </Modal>
  );
}
