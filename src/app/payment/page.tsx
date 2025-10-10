"use client";

import InfoPage from "@/components/Payment/payment";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Đang tải...</div>}>
      <InfoPage />
    </Suspense>
  );
}
