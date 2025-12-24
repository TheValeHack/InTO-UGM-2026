"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BubbleInput from "@/components/BubbleInput";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BubbleButton from "@/components/BubbleButton";
import admin from "@/data/admins.json";
import GradientTitle from "@/components/GradientTitle";

export default function AddVoucher() {
  const [allLoading, setAllLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
    type: "nominal",
    value: "",
    validUntil: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const fetchVouchers = async () => {
    try {
      const response = await fetch("/api/vouchers");
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers || []);
      } else {
        console.log("Gagal mengambil data voucher");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    const validateUser = async () => {
      if (!isLoading) {
        if (!session || !admin.includes(session?.user?.email)) {
          router.push("/");
        }
        setAllLoading(false);
      }
    };

    validateUser();
  }, [isLoading, session, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (voucher) => {
    setEditId(voucher._id);
    const date = new Date(voucher.valid_until);
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({
      code: voucher.code,
      type: voucher.type,
      value: voucher.discount,
      validUntil: formattedDate,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus voucher ini?")) return;

    try {
      const response = await fetch("/api/delete_voucher", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess("Voucher berhasil dihapus!");
        await fetchVouchers();
      } else {
        setError(data.error || "Gagal menghapus voucher.");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      setError("Gagal menghapus voucher.");
    }
  };

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    setError("");
    setSuccess("");

    const { code, type, value, validUntil } = formData;

    if (!code || !type || !value || !validUntil) {
      setError("Semua data harus diisi!");
      setIsLoadingSubmit(false);
      return;
    }

    try {
      const response = await fetch("/api/add_voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id: editId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editId ? "Voucher berhasil diupdate!" : "Voucher berhasil ditambahkan!");
        setFormData({
          code: "",
          type: "nominal",
          value: "",
          validUntil: "",
        });
        setEditId(null);
        await fetchVouchers()
      } else {
        setError(data.error || "Gagal memproses voucher.");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      setError("Gagal memproses voucher.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  if (allLoading) {
    return <></>;
  }

  return (
    session &&
    admin.includes(session?.user?.email) && (
      <div className="w-full overflow-hidden">
        <Navbar className={"navbar"} session={session} />
        <div className="max-w-[1950px] mx-auto flex flex-col w-screen relative">
          <section
            id="paket"
            className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
          >
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <div className="flex flex-col items-center gap-5">
                <GradientTitle title1={editId ? "Edit" : "Tambah"} title2="Voucher" />
              </div>
              <div className="flex flex-col mx-auto max-w-[1100px] gap-6 mt-12">
                <div className="flex flex-col items-start gap-3">
                  <div className="text-xl text-[#591D6A] font-bold">
                    Data Voucher
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                    <div className="flex-1">
                      <label className="text-base sm:text-lg text-[#591D6A]">
                        Kode Voucher
                      </label>
                      <BubbleInput
                        placeholder={"CONTOH99"}
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-base sm:text-lg text-[#591D6A]">
                        Tipe
                      </label>
                      <div className="w-full p-[4px] sm:p-[5px] mx-auto shadow-[inset_0px_0px_23.5px_6px_rgba(255,255,255,0.25)] rounded-[15px] sm:rounded-[20px] border-[4px] border-solid border-[#98367A] bg-[#F6D6FF] relative">
                        <div className="w-full h-full bg-white shadow-[inset_0px_0px_15px_6px_rgba(0,0,0,0.15)] rounded-[12px] overflow-hidden flex items-center justify-center">
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full h-full cursor-pointer px-3 sm:px-4 py-2 sm:py-4 bg-transparent outline-none border-none text-[10px] sm:text-base text-black"
                          >
                            <option value={"nominal"}>Nominal</option>
                            <option value={"percentage"}>Persentase</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                    <div className="flex-1">
                      <label className="text-base sm:text-lg text-[#591D6A]">
                        Nilai Diskon (Dalam nominal/persentase)
                      </label>
                      <BubbleInput
                        placeholder={"25000/15"}
                        inputType="number"
                        name="value"
                        max={formData.type == "percentage" ? 100 : 1000000}
                        value={formData.value}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-base sm:text-lg text-[#591D6A]">
                        Valid Until
                      </label>
                      <BubbleInput
                        inputType="date"
                        name="validUntil"
                        value={formData.validUntil}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm sm:text-base">{error}</div>
                )}
                {success && (
                  <div className="text-green-500 text-sm sm:text-base">{success}</div>
                )}
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                  <BubbleButton
                    scale={1}
                    className="text-3xl min-w-full md:min-w-64 py-6 md:py-4 mx-auto"
                    onClick={handleSubmit}
                  >
                    {isLoadingSubmit ? (
                      <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) : (
                      editId ? "Update Voucher" : "Tambah Voucher"
                    )}
                  </BubbleButton>
                  {editId && (
                    <BubbleButton
                      scale={1}
                      color="pink"
                      className="text-3xl min-w-full md:min-w-64 py-6 md:py-4 mx-auto"
                      onClick={() => {
                        setEditId(null);
                        setFormData({
                          code: "",
                          type: "nominal",
                          value: "",
                          validUntil: "",
                        });
                      }}
                    >
                      Batal Edit
                    </BubbleButton>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="table w-full max-w-[1200px] mx-auto table-auto border-collapse border-2 border-[#591D6A] mt-8">
                  <thead>
                    <tr>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-bold">KODE</th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-bold">TIPE</th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-bold">NILAI DISKON</th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-bold">VALID SAMPAI</th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-bold">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map((voucher) => (
                      <tr key={voucher._id}>
                        <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">{voucher.code}</td>
                        <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">{voucher.type}</td>
                        <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">{voucher.discount}</td>
                        <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">{new Date(voucher.valid_until).toLocaleDateString()}</td>
                        <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(voucher)}
                              title="Edit Voucher"
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors flex items-center justify-center shrink-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDelete(voucher._id)}
                              title="Hapus Voucher"
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors flex items-center justify-center shrink-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </section>
          <Footer />
        </div>
      </div>
    )
  );
}
