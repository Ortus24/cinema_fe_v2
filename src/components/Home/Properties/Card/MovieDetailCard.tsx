"use client";

import { useState } from "react";

interface Cinema {
  name: string;
  address: string;
  showtimes: string[];
}

const cinemas: Cinema[] = [
  {
    name: "Beta Quang Trung",
    address: "645 Quang Trung, Gò Vấp",
    showtimes: ["13:00", "15:30", "18:00", "20:30", "22:00"],
  },
  {
    name: "Beta Trần Quang Khải",
    address: "135 Trần Quang Khải, Quận 1",
    showtimes: ["13:00", "15:30", "18:00", "20:30", "22:00"],
  },
  {
    name: "BHD Star Vincom Gia Khảm",
    address: "561A Điện Biên Phủ, Bình Thạnh",
    showtimes: ["11:00", "13:30", "16:00", "18:30", "21:00"],
  },
  {
    name: "BHD Star Lê Văn Việt",
    address: "50 Lê Văn Việt, Quận 9",
    showtimes: ["11:00", "13:30", "16:00", "18:30", "21:00"],
  },
];

const MovieBooking = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [selectedCinema, setSelectedCinema] = useState<string>("Tất cả");

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  const filteredCinemas =
    selectedCinema === "Tất cả"
      ? cinemas
      : cinemas.filter((c) => c.name === selectedCinema);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Video + Poster */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md">
        <iframe
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://www.youtube.com/embed/LQYpLcz53pQ?autoplay=1&mute=1&loop=1&playlist=LQYpLcz53pQ&vq=hd1080"
          title="Trailer phim"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
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

      {/* Chọn ngày */}
      <div className="mb-6 mt-14">
        <label className="block font-semibold mb-2">Chọn ngày:</label>
        <div className="flex gap-2 flex-wrap">
          {next7Days.map((date) => (
            <button
              key={date}
              className={`px-4 py-2 rounded border ${
                selectedDate === date ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {new Date(date).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Chọn rạp */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Chọn rạp:</label>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded border ${
              selectedCinema === "Tất cả"
                ? "bg-green-500 text-white"
                : "bg-white"
            }`}
            onClick={() => setSelectedCinema("Tất cả")}
          >
            Tất cả rạp
          </button>
          {cinemas.map((cinema) => (
            <button
              key={cinema.name}
              className={`px-4 py-2 rounded border ${
                selectedCinema === cinema.name
                  ? "bg-green-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => setSelectedCinema(cinema.name)}
            >
              {cinema.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hiển thị showtime */}
      <div className="space-y-6">
        {filteredCinemas.map((cinema) => (
          <div key={cinema.name}>
            <h2 className="text-lg font-semibold mb-1">{cinema.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{cinema.address}</p>
            <div className="flex gap-2 flex-wrap">
              {cinema.showtimes.map((time) => (
                <span
                  key={time}
                  className="px-4 py-2 rounded border bg-white hover:bg-purple-100 cursor-pointer"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieBooking;
