"use client";

import { createContext, useContext, useState, useCallback } from "react";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [lastOrder, setLastOrder] = useState({});
  const [isLoadingPaymentStatus, setIsLoadingPaymentStatus] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTransactionDetails = useCallback(async (order_id) => {
    if (isProcessing) {
      console.log("Transaksi sedang diproses, tunggu hingga selesai.");
      return null;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/transactionsDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastOrder(data.transactions);
        return data.transactions;
      } else {
        console.log("Gagal mendapatkan status transaksi");
        return null;
      }
    } catch (error) {
      console.log("Terjadi kesalahan saat memuat data transaksi:", error);
      return null;
    } finally {
      setIsProcessing(false);
      setIsLoadingPaymentStatus(false);
    }
  }, [isProcessing]);

  return (
    <TransactionContext.Provider
      value={{
        lastOrder,
        isLoadingPaymentStatus,
        isProcessing,
        fetchTransactionDetails,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  return useContext(TransactionContext);
}
