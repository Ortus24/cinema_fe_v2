"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SeatSelectionModal from "../Seat";

/* =======================
 🎥 TypeScript Types
======================= */
type Movie = {
  title: string;
  duration: number;
  genre: string;
  language: string;
  release_date: string;
  description: string;
  image_url: string;
};

type Cinema = {
  cinema_id: number;
  name: string;
  address: string;
  phone: string;
};

type Room = {
  room_id: number;
  name: string;
  capacity: number;
  cinema: Cinema;
};

type Showtime = {
  showtime_id: number;
  start_time: string;
  price: string;
  movie: Movie;
  room: Room;
};

type DateItem = {
  id: number;
  date: number;
  month: number;
  dayOfWeek: string;
  label: string;
  fullDate: string;
};

/* =======================
 ⚙️ Component chính
======================= */
export default function SchedulePage() {
  const [showtimeData, setShowtimeData] = useState<Showtime[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<Cinema[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(
    null
  );

  /* =======================
   🗓️ Tạo danh sách ngày
  ======================= */
  const generateDates = (): DateItem[] => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        id: i,
        date: date.getDate(),
        month: date.getMonth() + 1,
        dayOfWeek: daysOfWeek[date.getDay()],
        label:
          i === 0
            ? "Hôm nay"
            : `${daysOfWeek[date.getDay()]} ${date.getDate()}/${
                date.getMonth() + 1
              }`,
        fullDate: date.toISOString().split("T")[0],
      };
    });
  };

  const dates = generateDates();

  /* =======================
   📡 Lấy dữ liệu từ API
  ======================= */
  useEffect(() => {
    // 🏢 Lấy toàn bộ cinema
    const fetchCinemas = async () => {
      try {
        const res = await fetch(
          "https://cinema-booking-l32q.onrender.com/cinema"
        );
        const data: Cinema[] = await res.json();
        setCinemas(data);
        setFilteredTheaters(data);

        // chọn rạp đầu tiên mặc định
        if (data.length > 0) setSelectedTheater(data[0].cinema_id);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách rạp:", err);
      }
    };

    // 🎞️ Lấy toàn bộ showtime
    const fetchShowtimes = async () => {
      try {
        const res = await fetch(
          "https://cinema-booking-l32q.onrender.com/showtimes"
        );
        const data: Showtime[] = await res.json();
        setShowtimeData(data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch chiếu:", err);
      }
    };

    fetchCinemas();
    fetchShowtimes();
  }, []);

  /* =======================
   🔍 Lọc rạp theo từ khóa
  ======================= */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTheaters(cinemas);
    } else {
      setFilteredTheaters(
        cinemas.filter((t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, cinemas]);

  /* =======================
 🎦 Lọc phim theo rạp & ngày
======================= */
  const filteredShowtimes = showtimeData.filter((item) => {
    const matchTheater =
      !selectedTheater || item.room.cinema.cinema_id === selectedTheater;

    const matchDate =
      selectedDate !== null &&
      selectedDate !== undefined &&
      item.start_time.startsWith(dates[selectedDate].fullDate);

    return matchTheater && matchDate;
  });

  // ✅ Gom các phim và giờ chiếu theo phòng
  const moviesByTitle = Object.values(
    filteredShowtimes.reduce((acc: any, item) => {
      const title = item.movie.title;
      const start = new Date(item.start_time);
      const end = new Date(start.getTime() + item.movie.duration * 60000);

      const startTime = start.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = end.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!acc[title]) {
        acc[title] = {
          ...item.movie,
          showtimes: [],
        };
      }

      acc[title].showtimes.push({
        showtime_id: item.showtime_id,
        roomName: item.room.name,
        timeStart: startTime,
        timeEnd: endTime,
      });

      return acc;
    }, {})
  );

  /* =======================
   🎨 Giao diện
  ======================= */
  return (
    <div
      id="schedule-section"
      className="flex flex-col md:flex-row justify-center gap-6 p-6 bg-gray-50 min-h-screen"
    >
      {/* Sidebar RẠP */}
      <div className="md:w-1/4 bg-white rounded-2xl shadow-md p-4 h-fit sticky top-6">
        <h2 className="text-lg font-semibold text-pink-600 mb-3 text-center">
          🎦 Danh sách rạp
        </h2>

        <input
          type="text"
          placeholder="🔍 Tìm rạp chiếu..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Danh sách rạp có thể cuộn */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-100">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.cinema_id}
              onClick={() => setSelectedTheater(theater.cinema_id)}
              className={`cursor-pointer p-3 rounded-lg border-l-4 transition-all ${
                selectedTheater === theater.cinema_id
                  ? "bg-pink-50 border-pink-500 font-semibold text-pink-700"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{theater.name}</span>
                <span className="text-xs text-gray-500">{theater.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lịch chiếu */}
      <div className="flex-1 max-w-5xl">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          📅 Lịch chiếu phim
        </h1>

        {/* Chọn ngày */}
        <div className="flex gap-2 overflow-x-auto scrollbar-thin justify-center mb-5">
          {dates.map((d) => (
            <Button
              key={d.id}
              onClick={() => setSelectedDate(d.id)}
              variant={selectedDate === d.id ? "default" : "outline"}
              className={`px-4 py-2 rounded-lg ${
                selectedDate === d.id
                  ? "bg-pink-500 text-white shadow-md"
                  : "hover:bg-pink-50"
              }`}
            >
              {d.label}
            </Button>
          ))}
        </div>

        {/* Danh sách phim */}
        <div className="bg-gradient-to-br from-pink-50 to-white shadow-inner rounded-xl border border-pink-100 p-4 mb-6 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50">
          {moviesByTitle.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 text-center animate-fadeIn">
              <img
                src="https://cinema-minio.onrender.com/cinema-bucket/image/2a37aad2-a5fd-421e-88d0-243b35627f6b-4076549.png"
                alt="No movies"
                className="w-40 h-40 mb-4 opacity-80"
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Oops! Không có suất chiếu nào trong ngày này 🎬
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Vui lòng chọn ngày khác hoặc thử một rạp chiếu khác để xem các
                suất chiếu đang hoạt động.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {moviesByTitle.map((movie: any) => {
                const showtimesByRoom = movie.showtimes.reduce(
                  (acc: any, show: any) => {
                    if (!acc[show.roomName]) acc[show.roomName] = [];
                    acc[show.roomName].push(show);
                    return acc;
                  },
                  {}
                );

                return (
                  <div
                    key={movie.title}
                    className="flex flex-col sm:flex-row bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden p-4"
                  >
                    <img
                      src={movie.image_url}
                      alt={movie.title}
                      className="w-full sm:w-56 h-72 object-cover rounded-2xl mb-3 sm:mb-0 sm:mr-6 shadow-md"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {movie.genre} • {movie.language}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {movie.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 mt-4">
                        {Object.entries(showtimesByRoom).map(
                          ([roomName, shows]: [string, any]) => (
                            <div key={roomName}>
                              <div className="font-medium text-gray-700 mb-2">
                                2D Phụ đề | {roomName}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {shows.map((show: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      setSelectedShowtimeId(show.showtime_id)
                                    }
                                    // 🟢 dùng id suất chiếu
                                    className="px-4 py-1 border border-blue-400 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                                  >
                                    {show.timeStart} ~ {show.timeEnd}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Modal chọn ghế */}
      {selectedShowtimeId && (
        <SeatSelectionModal
          showtimeId={selectedShowtimeId}
          onClose={() => setSelectedShowtimeId(null)}
        />
      )}
    </div>
  );
}
