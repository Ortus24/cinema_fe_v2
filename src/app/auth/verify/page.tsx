"use client";

import SignUpVerify from "@/components/Auth/SignUpVerify";
import { Suspense } from "react";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center gap-4 py-60">
            <div className="h-30 w-30 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <h3 className="text-lg font-medium text-gray-600">
              Đang xử lý đăng nhập...
            </h3>
          </div>
        </div>
      }
    >
      <SignUpVerify />
    </Suspense>
  );
}
