"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaketDewekanKahf() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/thanks-end");
    }, [router]);

    return null;
}
