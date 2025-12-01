"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SeatSelectionModal from "../Seat";
import { useRouter } from "next/navigation";

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

type MovieShowtime = {
  showtime_id: number;
  roomName: string;
  timeStart: string;
  timeEnd: string;
  dateLabel: string;
};

type MovieSchedule = Movie & {
  showtimes: MovieShowtime[];
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
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
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
  const router = useRouter();

  /* =======================
   🗓️ Tạo danh sách ngày
  ======================= */

  const goToDetail = (movieId: number) => {
    router.push("/movie?movieId=" + movieId);
  };

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cinemaRes, showtimeRes] = await Promise.all([
          fetch("http://localhost:3001/cinema"),
          fetch("http://localhost:3001/showtimes/current"),
        ]);

        if (cinemaRes.ok) {
          const cinemaData: Cinema[] = await cinemaRes.json();
          setCinemas(cinemaData);
        } else {
          console.error("Lỗi khi lấy danh sách rạp:", cinemaRes.statusText);
        }

        if (showtimeRes.ok) {
          const showtimeData: Showtime[] = await showtimeRes.json();
          setShowtimeData(showtimeData);
        } else {
          console.error("Lỗi khi lấy lịch chiếu:", showtimeRes.statusText);
        }
      } catch (err) {
        console.error("Đã xảy ra lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =======================
   🔁 Đồng bộ danh sách phòng
  ======================= */
  useEffect(() => {
    if (!cinemas.length) {
      setFilteredCinemas([]);
      setSelectedCinemaId(null);
      return;
    }

    const keyword = searchQuery.trim().toLowerCase();
    const nextList = keyword
      ? cinemas.filter((cinema) =>
          [cinema.name, cinema.address]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
      : cinemas;

    setFilteredCinemas(nextList);

    if (!selectedCinemaId && nextList.length > 0) {
      setSelectedCinemaId(nextList[0].cinema_id);
    } else if (
      selectedCinemaId &&
      !nextList.some((cinema) => cinema.cinema_id === selectedCinemaId) &&
      nextList.length > 0
    ) {
      setSelectedCinemaId(nextList[0].cinema_id);
    }
  }, [cinemas, searchQuery, selectedCinemaId]);

  /* =======================
  🎦 Lọc phim theo rạp + ngày
  ======================= */
  const selectedApiDate = dates[selectedDate]?.apiDate;

  const filteredShowtimes = showtimeData.filter((item) => {
    const matchCinema =
      !selectedCinemaId || item.room.cinema.cinema_id === selectedCinemaId;

    if (!selectedApiDate) return matchCinema;

    if (item.start_time.includes(selectedApiDate)) {
      return matchCinema;
    }

    const parsed = new Date(item.start_time);
    if (!Number.isNaN(parsed.getTime())) {
      const formatted = parsed
        .toLocaleDateString("vi-VN")
        .split("/")
        .map((part) => part.padStart(2, "0"))
        .join("/");
      return matchCinema && formatted === selectedApiDate;
    }

    const [datePart] = item.start_time.split(" ");
    if (datePart) {
      return matchCinema && datePart === selectedApiDate;
    }

    return false;
  });

  const moviesByTitle: MovieSchedule[] = Object.values(
    filteredShowtimes.reduce<Record<string, MovieSchedule>>((acc, item) => {
      const title = item.movie.title;
      const start = new Date(item.start_time);
      if (Number.isNaN(start.getTime())) return acc;

      const end = new Date(start.getTime() + item.movie.duration * 60000);
      const startTime = start.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = end.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateLabel = start.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!acc[title]) {
        acc[title] = { ...item.movie, showtimes: [] as MovieShowtime[] };
      }
      acc[title].showtimes.push({
        showtime_id: item.showtime_id,
        roomName: item.room.name,
        timeStart: startTime,
        timeEnd: endTime,
        dateLabel,
      });

      return acc;
    }, {})
  );

  /* =======================
   🎨 UI
  ======================= */
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 p-6 bg-gray-50 h-screen overflow-hidden">
      {/* Thêm CSS cho thanh cuộn */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px; /* Chiều rộng thanh cuộn */
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #081d64ff #faf1ffff;
        }
      `}</style>

      {/* Sidebar Rạp */}
      <div className="md:w-1/4 bg-white rounded-2xl shadow-md p-4 flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold text-pink-600 mb-3 text-center">
          🎦 Danh sách rạp
        </h2>

        <input
          type="text"
          placeholder="🔍 Tìm rạp hoặc địa chỉ..."
          className="w-full p-2 border rounded-lg mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Thêm class custom-scrollbar */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {filteredCinemas.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-6">
              Không tìm thấy rạp phù hợp.
            </div>
          ) : (
            filteredCinemas.map((cinema) => (
              <button
                type="button"
                key={cinema.cinema_id}
                onClick={() => {
                  setSelectedCinemaId(cinema.cinema_id);
                  setSelectedDate(0); // reset về hôm nay
                }}
                className={`w-full text-left p-3 rounded-lg border-l-4 transition-all ${
                  selectedCinemaId === cinema.cinema_id
                    ? "bg-pink-50 border-pink-500 font-semibold text-pink-700 shadow-sm"
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col">
                  <span>{cinema.name}</span>
                  <span className="text-xs text-gray-500">
                    {cinema.address}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Lịch chiếu */}
      <div className="flex-1 max-w-5xl flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          📅 Lịch chiếu phim
        </h1>

        {selectedCinemaId && (
          <div className="text-center text-sm text-gray-500 mb-6 space-y-1">
            <p className="font-medium text-gray-700">
              {
                cinemas.find((cinema) => cinema.cinema_id === selectedCinemaId)
                  ?.name
              }
            </p>
            <p>
              {
                cinemas.find((cinema) => cinema.cinema_id === selectedCinemaId)
                  ?.address
              }
            </p>
          </div>
        )}

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
          <div className="flex-1 flex flex-col items-center justify-center py-10">
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
          /* Thêm class custom-scrollbar */
          <div className="bg-white p-4 rounded-xl shadow-inner flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {moviesByTitle.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 text-center animate-fadeIn">
                <Image
                  src="https://cinema-booking-l32q.onrender.com/downloads/frontend/a2da2e00-05f7-4d67-9d2c-b7fe31e247f2-no-results.png"
                  alt="No movies"
                  width={160}
                  height={160}
                  className="mb-4 opacity-80"
                  unoptimized={true}
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
              moviesByTitle.map((movie) => {
                const sessionsByDate = movie.showtimes.reduce<
                  Record<string, Record<string, MovieShowtime[]>>
                >((acc, show) => {
                  if (!acc[show.dateLabel]) acc[show.dateLabel] = {};
                  if (!acc[show.dateLabel][show.roomName]) {
                    acc[show.dateLabel][show.roomName] = [];
                  }
                  acc[show.dateLabel][show.roomName].push(show);
                  return acc;
                }, {});

                return (
                  <div
                    key={movie.title}
                    className="flex flex-col sm:flex-row bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-4"
                  >
                    <Image
                      onClick={() => goToDetail(movie.movie_id)}
                      src={movie.image_url}
                      alt={movie.title}
                      width={224}
                      height={288}
                      className="w-full sm:w-56 h-72 object-cover rounded-2xl mb-3 sm:mb-0 sm:mr-6 shadow-md 
               transition-transform duration-300 ease-in-out hover:scale-105 relative hover:z-10"
                      unoptimized={true}
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

                      <div className="mt-4 space-y-3">
                        {Object.entries(sessionsByDate).map(
                          ([dateLabel, sessionsByRoom]) => (
                            <div
                              key={dateLabel}
                              className="rounded-lg bg-gray-50 p-3"
                            >
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                {dateLabel}
                              </div>
                              <div className="space-y-2">
                                {Object.entries(sessionsByRoom).map(
                                  ([roomName, sessions]) => (
                                    <div
                                      key={`${dateLabel}-${roomName}`}
                                      className="rounded-lg border border-dashed border-blue-200 bg-white/80 p-3"
                                    >
                                      <div className="text-xs font-semibold uppercase text-blue-600 mb-2">
                                        {roomName}
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {sessions
                                          .sort((a, b) =>
                                            a.timeStart.localeCompare(
                                              b.timeStart
                                            )
                                          )
                                          .map((show) => (
                                            <button
                                              key={show.showtime_id}
                                              onClick={() => {
                                                setSelectedShowtimeId(
                                                  show.showtime_id
                                                );
                                                setSelectedShowtimeLabel(
                                                  `${show.timeStart} ~ ${show.timeEnd}`
                                                );
                                                setSelectedMovieTitle(
                                                  movie.title
                                                );
                                              }}
                                              className="px-4 py-1 border border-blue-400 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
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
                          )
                        )}
                      </div>
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
          movieTitle={selectedMovieTitle}
          showtime={selectedShowtimeLabel}
          onClose={() => setSelectedShowtimeId(null)}
        />
      )}
    </div>
  );
}
