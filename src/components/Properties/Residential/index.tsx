"use client";
import React, { useEffect, useState } from "react";

const ResidentialList: React.FC = () => {
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Danh sách lịch chiếu và ghế đã đặt tương ứng
  const showtimes = [
    {
      time: "17:00 - Phòng 2 - 4DX",
      bookedSeats: ["A1", "B5", "C3"],
    },
    {
      time: "18:30 - Phòng 1 - IMAX",
      bookedSeats: ["D7", "E2", "F4"],
    },
    {
      time: "19:15 - Phòng 2 - 4DX",
      bookedSeats: ["G6", "H1"],
    },
    {
      time: "20:45 - Phòng 1 - IMAX",
      bookedSeats: ["I9", "J10"],
    },
    {
      time: "21:30 - Phòng 2 - 4DX",
      bookedSeats: ["A2", "B3"],
    },
    {
      time: "22:00 - Phòng 1 - IMAX",
      bookedSeats: ["C4", "D5"],
    },
  ];

  const toggleSeat = (seat: string) => {
    const currentBooked =
      showtimes.find((s) => s.time === selectedShowtime)?.bookedSeats || [];
    if (currentBooked.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const currentBookedSeats =
    showtimes.find((s) => s.time === selectedShowtime)?.bookedSeats || [];

  useEffect(() => {
    if (!selectedShowtime) {
      setSelectedShowtime(showtimes[0].time);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Video + Poster */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://cinema-minio.onrender.comcinema-bucket/movie/conan/541eae8d-85db-4a10-8656-9625f5f53cb8-conantrailer.mp4"
          title="Trailer phim"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <div className="absolute bottom-4 left-4 w-40 h-56 rounded-lg overflow-hidden shadow-lg z-20 border-2 border-white">
          <img
            src="/images/categories/conan.jpg"
            alt="Poster phim"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 left-48 text-white z-20">
          <h2 className="text-2xl font-bold">Thám Tử Lừng Danh Conan</h2>
          <p className="text-white/80">
            Dư Ảnh Của Độc Nhãn – Khởi chiếu 25/07/2025
          </p>
        </div>
      </div>

      {/* Lịch chiếu */}
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md text-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-center">
          🕒 Chọn Lịch Chiếu
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {showtimes.map((s) => (
            <button
              key={s.time}
              onClick={() => {
                setSelectedShowtime(s.time);
                setSelectedSeats([]);
              }}
              className={`px-4 py-2 rounded-full border ${
                selectedShowtime === s.time
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              } hover:bg-blue-200 transition`}
            >
              {s.time}
            </button>
          ))}
        </div>
      </div>

      {/* Sơ đồ ghế */}
      {selectedShowtime && (
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md text-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-center">
            🪑 Sơ Đồ Ghế Ngồi
          </h2>
          <div className="grid grid-cols-10 gap-2 justify-center">
            {Array.from({ length: 100 }).map((_, i) => {
              const seat = `${String.fromCharCode(65 + Math.floor(i / 10))}${
                (i % 10) + 1
              }`;
              const isBooked = currentBookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  className={`w-8 h-8 rounded transition ${
                    isBooked
                      ? "bg-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-600 text-white"
                      : "bg-green-200 hover:bg-green-400"
                  }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          {/* Mô tả màu sắc */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-400"></div>
              <span>Ghế đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-600"></div>
              <span>Ghế bạn đang chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-200"></div>
              <span>Ghế trống</span>
            </div>
          </div>
        </div>
      )}

      {/* Nút đặt vé */}
      <div className="text-center">
        <button
          disabled={!selectedShowtime || selectedSeats.length === 0}
          className={`px-6 py-3 rounded-full font-semibold text-white transition ${
            selectedShowtime && selectedSeats.length > 0
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() =>
            alert(
              `Bạn đã đặt ${selectedSeats.length} ghế: ${selectedSeats.join(
                ", "
              )} cho suất chiếu: ${selectedShowtime}`
            )
          }
        >
          ✅ Đặt Vé
        </button>
      </div>
    </div>
  );
};

export default ResidentialList;
