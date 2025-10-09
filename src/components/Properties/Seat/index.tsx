"use client";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type Seat = {
  seat_number: string;
  seat_type: "VIP" | "THUONG";
  is_booked: boolean;
  price: number;
};

interface SeatSelectionModalProps {
  showtimeId: number | null;
  onClose: () => void;
}

export default function SeatSelectionModal({
  showtimeId,
  onClose,
}: SeatSelectionModalProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(() => {
    return seats
      .filter((seat) => selectedSeats.includes(seat.seat_number))
      .reduce((sum, seat) => {
        // chuyển price sang number an toàn
        const p = Number(String(seat.price).replace(/[^0-9.-]+/g, ""));
        return sum + (isNaN(p) ? 0 : p);
      }, 0);
  }, [selectedSeats, seats]);

  useEffect(() => {
    if (!showtimeId) return;

    const fetchSeats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://cinema-booking-l32q.onrender.com/showtime/${showtimeId}`
        );
        const data = await res.json();
        setSeats(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách ghế:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showtimeId]);

  const handleSelectSeat = (seat: Seat) => {
    if (seat.is_booked) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seat_number)
        ? prev.filter((s) => s !== seat.seat_number)
        : [...prev, seat.seat_number]
    );
  };

  const getSeatClass = (seat: Seat) => {
    // Ghế đã đặt
    if (seat.is_booked) return "bg-gray-800 text-gray-400 cursor-not-allowed";

    // Ghế đang chọn
    if (selectedSeats.includes(seat.seat_number))
      return "bg-pink-500 text-white";

    // Ghế VIP
    if (seat.seat_type.toUpperCase() === "VIP")
      return "bg-red-500 text-white hover:bg-red-600";

    // Ghế thường (Standard, Thuong,...)
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  if (!showtimeId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
          🎟️ Chọn ghế ngồi
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Chọn ghế bạn muốn và tiến hành đặt vé
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-pink-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <div className="text-center text-gray-500 text-lg font-medium">
              Đang tải ghế...
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 text-center w-3/4 py-2 mb-4 rounded-md font-medium text-gray-600">
              MÀN HÌNH
            </div>

            {/* Hiển thị ghế theo từng hàng (A, B, C...) */}
            <div className="flex flex-col items-center gap-3">
              {Object.entries(
                seats.reduce((acc, seat) => {
                  const row = seat.seat_number[0]; // Lấy chữ cái hàng (A, B, C...)
                  if (!acc[row]) acc[row] = [];
                  acc[row].push(seat);
                  return acc;
                }, {} as Record<string, Seat[]>)
              )
                // 🔹 Sắp xếp theo thứ tự hàng từ A → Z
                .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
                .map(([row, rowSeats]) => {
                  // 🔹 Sắp xếp ghế trong hàng theo số: A1, A2, A3,...
                  const sortedRowSeats = rowSeats.sort((a, b) => {
                    const numA = parseInt(a.seat_number.slice(1));
                    const numB = parseInt(b.seat_number.slice(1));
                    return numA - numB;
                  });

                  return (
                    <div key={row} className="flex gap-2 items-center">
                      {/* Hiển thị tên hàng (A, B, C...) */}
                      <span className="w-5 font-semibold text-gray-600">
                        {row}
                      </span>

                      {/* Các ghế trong hàng */}
                      {sortedRowSeats.map((seat) => (
                        <button
                          key={seat.seat_number}
                          onClick={() => handleSelectSeat(seat)}
                          className={`w-10 h-10 rounded-md text-xs font-semibold ${getSeatClass(
                            seat
                          )}`}
                        >
                          {seat.seat_number}
                        </button>
                      ))}
                    </div>
                  );
                })}
            </div>

            {/* Chú thích màu */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div> Ghế thường
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div> Ghế VIP
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div> Ghế bạn chọn
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 rounded"></div> Đã đặt
              </div>
            </div>

            {/* Tổng tiền + Nút mua */}
            <div className="flex justify-between items-center w-full mt-6 border-t pt-4">
              <div className="text-gray-700">
                <p className="text-sm">
                  Ghế đã chọn:{" "}
                  <span className="font-semibold text-pink-600">
                    {selectedSeats.join(", ") || "Chưa chọn"}
                  </span>
                </p>
                <p className="text-sm mt-1">
                  Tổng tiền:{" "}
                  <span className="font-semibold text-pink-600">
                    {totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </p>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                className={`px-6 py-3 rounded-full font-semibold ${
                  selectedSeats.length > 0
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Mua vé
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
