"use client";
import { useEffect } from "react";

export default function AuthPopupPage() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (token && window.opener) {
      console.log("Sending token to opener window:", token);
      localStorage.setItem("token", token);
      window.opener.postMessage({ token }, window.location.origin);

      window.parent.postMessage({ type: "LOGIN_SUCCESS" }, "*");
    }
    console.log("Token sent to opener window");
    setTimeout(() => window.close(), 300);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-40">
      <div className="h-30 w-30 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      <h3 className="text-lg font-medium text-gray-600">Đang tải...</h3>
    </div>
  );
}
