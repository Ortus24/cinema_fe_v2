"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SeatSelectionModal from "../Seat";

/* =======================
 🎥 TypeScript Types
======================= */
type Movie = {
  movie_id: number;
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
  apiDate: string;
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(
    null
  );
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string | null>(
    null
  );
  const [selectedShowtimeLabel, setSelectedShowtimeLabel] = useState<
    string | null
  >(null);

  /* =======================
   🗓️ Tạo danh sách ngày
  ======================= */
  const generateDates = (): DateItem[] => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const dayStr = day < 10 ? "0" + day : day;
      const monthStr = month < 10 ? "0" + month : month;

      return {
        id: i,
        date: day,
        month: month,
        dayOfWeek: daysOfWeek[date.getDay()],
        label:
          i === 0
            ? "Hôm nay"
            : `${daysOfWeek[date.getDay()]} ${dayStr}/${monthStr}`,
        fullDate: `${year}-${monthStr}-${dayStr}`,
        apiDate: `${dayStr}/${monthStr}/${year}`,
      };
    });
  };

  const dates = generateDates();

  /* =======================
   📡 Fetch API
  ======================= */
  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://cinema-booking-l32q.onrender.com/cinema"
        );
        const data: Cinema[] = await res.json();
        setCinemas(data);
        setFilteredTheaters(data);
        if (data.length > 0) setSelectedTheater(data[0].cinema_id);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách rạp:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchShowtimes = async () => {
      try {
        const res = await fetch(
          "https://cinema-booking-l32q.onrender.com/showtimes/current"
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
   🔍 Lọc rạp theo tìm kiếm
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
  🎦 Lọc phim theo rạp + ngày
  ======================= */
  const selectedApiDate = dates[selectedDate]?.apiDate;

  const filteredShowtimes = showtimeData.filter((item) => {
    const matchTheater =
      !selectedTheater || item.room.cinema.cinema_id === selectedTheater;
    const matchDate =
      selectedApiDate && item.start_time.startsWith(selectedApiDate);
    return matchTheater && matchDate;
  });

  const moviesByTitle = Object.values(
    filteredShowtimes.reduce((acc: any, item) => {
      const title = item.movie.title;

      const [datePart, timePart] = item.start_time.split(" ");
      const [day, month, year] = datePart.split("/");
      const isoString = `${year}-${month}-${day}T${timePart}`;
      const start = new Date(isoString);
      if (isNaN(start.getTime())) return acc;

      const end = new Date(start.getTime() + item.movie.duration * 60000);
      const startTime = start.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = end.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!acc[title]) acc[title] = { ...item.movie, showtimes: [] };
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
   🎨 UI
  ======================= */
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar Rạp */}
      <div className="md:w-1/4 bg-white rounded-2xl shadow-md p-4 h-fit sticky top-6">
        <h2 className="text-lg font-semibold text-pink-600 mb-3 text-center">
          🎦 Danh sách rạp
        </h2>

        <input
          type="text"
          placeholder="🔍 Tìm rạp chiếu..."
          className="w-full p-2 border rounded-lg mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
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
              <span className="font-medium">{theater.name}</span>
              <span className="text-xs text-gray-500">{theater.address}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lịch chiếu */}
      <div className="flex-1 max-w-5xl">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          📅 Lịch chiếu phim
        </h1>

        <div className="flex gap-2 overflow-x-auto justify-center mb-5">
          {dates.map((d) => (
            <Button
              key={d.id}
              onClick={() => setSelectedDate(d.id)}
              variant={selectedDate === d.id ? "default" : "outline"}
              className={selectedDate === d.id ? "bg-pink-500 text-white" : ""}
            >
              {d.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <svg
              className="animate-spin h-16 w-16 text-pink-500 mb-4"
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
              Đang tải lịch chiếu...
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-inner max-h-[800px] overflow-y-auto">
            {moviesByTitle.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 text-center animate-fadeIn">
                <img
                  src="https://cinema-minio.onrender.com/cinema-bucket/image/5e2aedef-0d08-4d45-bbbd-27f542a1f516-4076549.png"
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
              // <p className="text-center text-gray-600 mt-10">
              //   Không có suất chiếu
              // </p>
              moviesByTitle.map((movie: any) => {
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

                      {Object.entries(showtimesByRoom).map(
                        ([roomName, shows]: any) => (
                          <div key={roomName} className="mt-4">
                            <div className="font-medium text-gray-700 mb-2">
                              2D Phụ đề | {roomName}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {shows.map((show: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSelectedShowtimeId(show.showtime_id);
                                    setSelectedShowtimeLabel(
                                      `${show.timeStart} ~ ${show.timeEnd}`
                                    );
                                    setSelectedMovieTitle(movie.title);
                                  }}
                                  className="px-4 py-1 border border-blue-400 text-blue-600 rounded-lg text-sm hover:bg-blue-50"
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
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedShowtimeId && (
        <SeatSelectionModal
          showtimeId={selectedShowtimeId}
          movieTitle={selectedMovieTitle || "Chọn ghế"}
          showtime={selectedShowtimeLabel || "N/A"}
          onClose={() => setSelectedShowtimeId(null)}
        />
      )}
    </div>
  );
}
