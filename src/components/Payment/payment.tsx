"use client";

import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function InfoPage() {
  const searchParams = useSearchParams();

  const handleCloseIframe = () => {
    window.parent.postMessage({ type: "PAYOS_CLOSE_IFRAME" }, "*");
  };

  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleCloseIframe}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        <X size={22} />
      </button>
      12312312312312323
      {cancel === "true" ? (
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-4xl text-red-500">✖️</span>
          </div>
          <h1 className="text-2xl font-extrabold mb-2 text-red-600">
            Giao dịch đã bị hủy!
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Giao dịch của bạn đã bị hủy.
            <br />
            Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.
          </p>
          <button
            onClick={handleCloseIframe}
            className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Đóng
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-pink-600">
            Kết quả thanh toán
          </h1>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-gray-700 space-y-2">
            <p>
              <strong>Mã đơn hàng:</strong> {orderCode}
            </p>
            <p>
              <strong>Trạng thái:</strong> {status}
            </p>
            <p>
              <strong>Mã giao dịch:</strong> {id}
            </p>
            <p>
              <strong>Mã code:</strong> {code}
            </p>
            <p>
              <strong>Hủy giao dịch:</strong> {cancel}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
