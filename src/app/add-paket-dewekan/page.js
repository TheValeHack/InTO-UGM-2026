"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BubbleInput from "@/components/BubbleInput";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BubbleButton from "@/components/BubbleButton";
import admin from "@/data/admins.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExcelJS from 'exceljs';
import GradientTitle from "@/components/GradientTitle";

export default function ManageParticipants() {
  let indexParticipant = 0
  const [allLoading, setAllLoading] = useState(true);
  const [participantsData, setParticipantsData] = useState([]);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedDate, setSelectedDate] = useState(null); // State untuk filter tanggal
  const [filteredData, setFilteredData] = useState([]);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Participants Data");

    worksheet.columns = [
      { header: "ORDER ID", key: "order_id", width: 20 },
      { header: "PAKET", key: "package", width: 15 },
      { header: "NAMA", key: "name", width: 25 },
      { header: "EMAIL", key: "email", width: 25 },
      { header: "SEKOLAH", key: "school", width: 25 },
      { header: "NOMOR TELEPON", key: "phone", width: 20 },
      { header: "KODE", key: "kode", width: 15 },
      { header: "IS_USER", key: "is_user", width: 10 },
      { header: "WAKTU DIBELI", key: "created_at", width: 25 },
    ];

    filteredData.forEach((order) => {
      order.participants.forEach((participant) => {
        worksheet.addRow({
          order_id: order.order_id,
          package: order.package.name,
          name: participant.name,
          email: participant.email,
          school: participant.school,
          phone: participant.phone,
          kode: participant.kode,
          is_user: participant.is_user ? "Yes" : "No",
          created_at: new Date(order.created_at).toLocaleString(),
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "participants_data.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };


  const fetchParticipants = async () => {
    try {
      const response = await fetch("/api/participants");
      if (response.ok) {
        const data = await response.json();
        setParticipantsData(data.data || []);
        setFilteredData(data.data || []); // Atur data awal untuk tabel
      } else {
        console.log("Gagal mengambil data peserta");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
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

  const handleFilterByDate = () => {
    if (selectedDate) {
      const filtered = participantsData.filter((order) =>
        new Date(order.created_at).toDateString() ===
        selectedDate.toDateString()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(participantsData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (participant) => {
    setEditId(participant.id);
    setFormData({
      name: participant.name,
      email: participant.email,
      school: participant.school,
      phone: participant.phone,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus peserta ini?")) return;

    try {
      const response = await fetch("/api/delete_participant", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess("Peserta berhasil dihapus!");
        await fetchParticipants();
      } else {
        setError(data.error || "Gagal menghapus peserta.");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      setError("Gagal menghapus peserta.");
    }
  };

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    setError("");
    setSuccess("");

    const { name, email, school, phone } = formData;

    if (!name || !email || !school || !phone) {
      setError("Semua data harus diisi!");
      setIsLoadingSubmit(false);
      return;
    }

    try {
      const response = await fetch("/api/add_participant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          name,
          email,
          school,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editId ? "Peserta berhasil diupdate!" : "Peserta berhasil ditambahkan!");
        setFormData({
          name: "",
          email: "",
          school: "",
          phone: "",
        });
        setEditId(null);
        await fetchParticipants();
      } else {
        setError(data.error || "Gagal memproses peserta.");
      }
      setIsLoadingSubmit(false);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      setError("Gagal memproses peserta.");
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
            id="participants"
            className="w-full min-h-[75vh] py-32 flex flex-col justify-start items-center relative"
          >
            <div className="px-6 md:px-12 lg:px-16 w-full relative">
              <div className="flex flex-col items-center gap-5">
                <GradientTitle title1={editId ? "Edit" : "Manajemen"} title2="Peserta" />
              </div>
              <div className="flex flex-col mx-auto max-w-[1100px] gap-6 mt-12">
                <div className="flex flex-col items-start gap-3">
                  <div className="text-xl text-[#591D6A] font-bold">
                    {editId ? "Edit Peserta" : "Tambah Peserta"}
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                    <div className="flex-1">
                      <label className="text-xs sm:text-base text-[#591D6A]">
                        Nama
                      </label>
                      <BubbleInput
                        placeholder={"Nama Peserta"}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs sm:text-base text-[#591D6A]">
                        Email
                      </label>
                      <BubbleInput
                        placeholder={"Email Peserta"}
                        inputType="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-8 w-full">
                    <div className="flex-1">
                      <label className="text-xs sm:text-base text-[#591D6A]">
                        Asal Sekolah
                      </label>
                      <BubbleInput
                        placeholder={"Asal Sekolah"}
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs sm:text-base text-[#591D6A]">
                        Nomor Telepon
                      </label>
                      <BubbleInput
                        placeholder={"Nomor Telepon"}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-base sm:text-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-500 text-base sm:text-lg">
                    {success}
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                  <BubbleButton
                    scale={1}
                    className="text-3xl min-w-full md:min-w-64 py-6 md:py-4 mx-auto"
                    onClick={handleSubmit}
                  >
                    {isLoadingSubmit ? (
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-white animate-spin fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : editId ? (
                      "Update Peserta"
                    ) : (
                      "Tambah Peserta"
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
                          name: "",
                          email: "",
                          school: "",
                          phone: "",
                        });
                      }}
                    >
                      Batal Edit
                    </BubbleButton>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 md:px-12 mt-24 lg:px-16 w-full relative">
              <div className="flex flex-col items-center gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-full p-[4px] sm:p-[5px] mx-auto shadow-[inset_0px_0px_23.5px_6px_rgba(255,255,255,0.25)] rounded-[15px] sm:rounded-[20px] border-[4px] border-solid border-[#98367A] bg-[#F6D6FF] relative">
                    <div className="w-full h-full bg-white shadow-[inset_0px_0px_15px_6px_rgba(0,0,0,0.15)] rounded-[12px] overflow-hidden flex items-center justify-center">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full h-full px-3 sm:px-4 py-2 sm:py-4 bg-transparent outline-none border-none text-[10px] sm:text-base text-black"
                        placeholderText="Pilih Tanggal"
                      />
                    </div>
                  </div>
                  <BubbleButton
                    onClick={handleFilterByDate}
                    scale={1}
                    color="pink"
                    className="text-3xl py-6 md:py-4"
                  >
                    Filter
                  </BubbleButton>
                </div>
                <BubbleButton
                  scale={1}
                  color="green"
                  className="text-3xl min-w-full md:min-w-64 py-6 md:py-4 mx-auto mt-6"
                  onClick={downloadExcel}
                >
                  Unduh Data
                </BubbleButton>
              </div>
              <div className="overflow-x-auto mt-8">
                <table className="table w-full max-w-[1200px] mx-auto table-auto border-collapse border-2 border-[#591D6A]">
                  <thead>
                    <tr>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        NO
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        ORDER ID
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        PAKET
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        NAMA
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        EMAIL
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        SEKOLAH
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        NOMOR TELEPON
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        KODE
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        IS_USER
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        WAKTU DIBELI
                      </th>
                      <th className="border-2 border-[#591D6A] text-[#591D6A] text-center font-bold">
                        AKSI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((order) =>
                      order.participants.map((participant) => {
                        indexParticipant += 1;
                        return (
                          <tr key={participant.id}>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {indexParticipant}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {order.order_id}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {order.package?.name || "Tidak Ada"}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.name}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.email}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.school}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.phone}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.kode}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.is_user ? "Ya" : "Tidak"}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] text-center font-medium">
                              {participant.created_at}
                            </td>
                            <td className="border-2 border-[#591D6A] text-[#591D6A] p-2 text-center font-medium">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleEdit(participant)}
                                  title="Edit Peserta"
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors flex items-center justify-center shrink-0"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(participant.id)}
                                  title="Hapus Peserta"
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors flex items-center justify-center shrink-0"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
