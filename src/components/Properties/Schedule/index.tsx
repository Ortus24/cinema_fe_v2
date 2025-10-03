"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SchedulePage() {
  const [selectedCity, setSelectedCity] = useState("Hồ Chí Minh");
  const [selectedTheater, setSelectedTheater] = useState(
    "CGV Vincom Mega Mall Grand Park"
  );
  const [selectedDay, setSelectedDay] = useState(3);

  // ✅ Loại bỏ rạp trùng lặp
  const theaters = [
    "CGV Vincom Mega Mall Grand Park",
    "CGV Giga Mall Thủ Đức",
    "CGV Aeon Bình Tân",
    "CGV Pearl Plaza",
    "CGV Saigonres Nguyễn Xí",
    "CGV Hoàng Văn Thụ",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
    "CGV Liberty Citypoint",
  ];

  const uniqueTheaters = [...new Set(theaters)];

  const days = [
    { id: 3, label: "Th 3, 14 Thg 11" },
    { id: 4, label: "Th 4, 15 Thg 11" },
    { id: 5, label: "Th 5, 16 Thg 11" },
    { id: 6, label: "Th 6, 17 Thg 11" },
    { id: 7, label: "Th 7, 18 Thg 11" },
    { id: 8, label: "CN, 19 Thg 11" },
  ];

  const scheduleData = {
    "CGV Vincom Mega Mall Grand Park": {
      3: [
        {
          title: "Tử Chiến Trên Không",
          genre: "Hình Sự, Hành Động, Gay Cấn",
          rating: "16+",
          image: "/tuchientrenkhong.jpg",
          times: ["09:50", "13:00", "17:40", "20:00"],
        },
        {
          title: "Chainsaw Man - The Movie: Chương Reze",
          genre: "Hoạt Hình, Hành Động, Giả Tưởng",
          rating: "18+",
          image: "/chainsawman.jpg",
          times: ["10:00", "13:20", "16:30", "19:50"],
        },
      ],
    },
    "CGV Liberty Citypoint": {
      "CGV Vincom Mega Mall Grand Park": {
        3: [
          {
            title: "Tử Chiến Trên Không",
            genre: "Hình Sự, Hành Động, Gay Cấn",
            rating: "16+",
            image: "/tuchientrenkhong.jpg",
            times: ["09:50", "13:00", "17:40", "20:00"],
          },
          {
            title: "Chainsaw Man - The Movie: Chương Reze",
            genre: "Hoạt Hình, Hành Động, Giả Tưởng",
            rating: "18+",
            image: "/chainsawman.jpg",
            times: ["10:00", "13:20", "16:30", "19:50"],
          },
        ],
        4: [
          {
            title: "Venom: Kẻ Báo Thù Cuối Cùng",
            genre: "Hành Động, Viễn Tưởng",
            rating: "13+",
            image: "/venom.jpg",
            times: ["10:30", "14:10", "18:30", "21:40"],
          },
        ],
      },

      "CGV Giga Mall Thủ Đức": {
        3: [
          {
            title: "Thanh Gươm Diệt Quỷ",
            genre: "Hoạt Hình, Phiêu Lưu",
            rating: "13+",
            image: "/kimetsu.jpg",
            times: ["09:00", "12:30", "16:10", "19:45"],
          },
        ],
        4: [
          {
            title: "Godzilla x Kong",
            genre: "Hành Động, Kỳ Ảo",
            rating: "16+",
            image: "/godzilla.jpg",
            times: ["11:00", "14:30", "18:00", "21:30"],
          },
        ],
      },

      "CGV Aeon Bình Tân": {
        3: [
          {
            title: "Inside Out 2",
            genre: "Hoạt Hình, Gia Đình",
            rating: "P",
            image: "/insideout2.jpg",
            times: ["09:15", "11:30", "14:00", "16:20", "18:40", "21:00"],
          },
          {
            title: "Deadpool & Wolverine",
            genre: "Hành Động, Hài",
            rating: "18+",
            image: "/deadpool.jpg",
            times: ["10:00", "13:00", "16:00", "19:00", "22:00"],
          },
        ],
      },

      "CGV Pearl Plaza": {
        3: [
          {
            title: "Avatar: Dòng Chảy Của Nước",
            genre: "Hành Động, Viễn Tưởng",
            rating: "13+",
            image: "/avatar2.jpg",
            times: ["09:00", "13:30", "18:00", "21:30"],
          },
        ],
      },

      "CGV Saigonres Nguyễn Xí": {
        3: [
          {
            title: "Oppenheimer",
            genre: "Tiểu Sử, Chính Kịch",
            rating: "16+",
            image: "/oppenheimer.jpg",
            times: ["08:30", "12:00", "15:30", "19:00", "22:30"],
          },
        ],
      },

      "CGV Hoàng Văn Thụ": {
        3: [
          {
            title: "Barbie",
            genre: "Hài, Phiêu Lưu",
            rating: "13+",
            image: "/barbie.jpg",
            times: ["09:20", "11:40", "14:10", "16:30", "19:00", "21:20"],
          },
        ],
      },

      "CGV Liberty Citypoint": {
        3: [
          {
            title: "Spider-Man: Across the Spider-Verse",
            genre: "Hoạt Hình, Hành Động",
            rating: "13+",
            image: "/spiderman.jpg",
            times: ["10:00", "13:00", "16:00", "19:00", "22:00"],
          },
        ],
      },
    },
    // ... các rạp khác giữ nguyên như cũ
  };

  const movies = scheduleData[selectedTheater]?.[selectedDay] || [];

  return (
    <div className="flex flex-col items-center w-full p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Lịch chiếu phim</h1>

      {/* Bộ lọc vị trí */}
      <div className="flex gap-4 items-center mb-6">
        <select
          className="border rounded-lg p-2"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option>Hồ Chí Minh</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
        </select>
        <Button variant="outline">Gần bạn</Button>
      </div>

      {/* Layout chia cột */}
      <div className="grid grid-cols-12 gap-6 w-full max-w-6xl">
        {/* Cột trái */}
        <div className="col-span-3 bg-white border rounded-lg p-4 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {uniqueTheaters.map((t, index) => (
            <div
              key={`${t}-${index}`}
              onClick={() => setSelectedTheater(t)}
              className={`cursor-pointer p-2 rounded-md mb-2 border-l-4 ${
                selectedTheater === t
                  ? "bg-pink-50 border-pink-500 font-semibold text-pink-600"
                  : "border-transparent hover:bg-gray-100"
              }`}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Cột phải */}
        <div className="col-span-9">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">{selectedTheater}</h2>
                  <p className="text-sm text-gray-500">
                    Lô L5-01, Tầng 5, Trung Tâm Thương Mại Vincom Mega Mall
                    Grand Park
                  </p>
                </div>
              </div>

              {/* Ngày */}
              <div className="flex gap-2 mb-4">
                {days.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.id)}
                    className={`rounded-md px-3 py-1 border text-sm ${
                      d.id === selectedDay
                        ? "bg-pink-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Danh sách phim */}
              <div className="space-y-6">
                {movies.map((m) => (
                  <div key={m.title} className="border-b pb-4">
                    <div className="flex gap-4">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-24 h-36 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-orange-500 text-white px-2 py-0.5 text-sm rounded-md">
                            {m.rating}
                          </span>
                          <h3 className="text-lg font-semibold">{m.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{m.genre}</p>
                        <div className="flex flex-wrap gap-2">
                          {m.times.map((t) => (
                            <Button
                              key={t}
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              {t}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button className="mt-6 bg-pink-600 hover:bg-pink-700">Xem tất cả</Button>
    </div>
  );
}
