"use client";

import SeatSelectionModal from "@/components/Properties/Seat";
import { useEffect, useMemo, useState } from "react";

type MovieDetail = {
  movie_id: number;
  title: string;
  duration: number;
  genre: string;
  language: string;
  release_date: string;
  description: string;
  image_url: string;
  trailer_url?: string;
  director?: string;
  cast?: string[] | string;
  country?: string;
  age_rating?: string;
  imdb_rating?: number;
  format?: string;
};

type Cinema = {
  cinema_id: number;
  name: string;
  address: string;
  phone: string;
};

type Showtime = {
  showtime_id: number;
  start_time: string;
  end_time?: string;
  room?: {
    room_id: number;
    name: string;
    cinema?: {
      cinema_id: number;
      name: string;
    };
  };
  room_id?: number;
  cinema_id?: number;
};

type TimeSlotInfo = {
  time: string;
  showtimeId: number;
};

type RoomSchedule = {
  room_id: number;
  roomName: string;
  cinema_id: number;
  cinemaName: string;
  cinemaAddress: string;
  sessions: Record<
    string,
    {
      dateLabel: string;
      apiDate: string;
      timeSlots: TimeSlotInfo[];
    }
  >;
};

type GroupedShowtimes = {
  room_id: number;
  roomName: string;
  cinema_id: number;
  cinemaName: string;
  cinemaAddress: string;
  sessions: {
    dateLabel: string;
    apiDate: string;
    timeSlots: TimeSlotInfo[];
  }[];
};

type ModalInfo = {
  roomName: string;
  cinemaName: string;
  cinemaAddress: string;
  dateLabel: string;
  time: string;
  showtimeId: number;
};

const HeroSub = ({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) => (
  <header className="bg-gray-100 py-2">
    <div className="max-w-5xl mx-auto">
      <span className="text-sm font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
        {badge}
      </span>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
        {title}
      </h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  </header>
);

export default function MovieDetail() {
  const [movieId, setMovieId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("movieId");
    setMovieId(id);
  }, []);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);
  const [cinemaMap, setCinemaMap] = useState<Record<number, Cinema>>({});
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(
    null
  );
  const [selectedShowtimeLabel, setSelectedShowtimeLabel] = useState<
    string | null
  >(null);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string | null>(
    null
  );

  const [cinemas, setCinemas] = useState<Cinema[]>([]); // Master list
  // --- THAY ĐỔI: Thêm state cho rạp đã lọc ---
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);

  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        setMovie(null);
        return;
      }

      const numericId = Number(movieId);
      if (Number.isNaN(numericId)) {
        setMovie(null);
        setError("Mã phim không hợp lệ.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchById = async () => {
          const res = await fetch(
            `https://cinema-minio.onrender.com/movie/${numericId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          if (!res.ok) {
            throw new Error("Không tìm thấy thông tin phim");
          }
          return res.json();
        };

        let data = await fetchById();

        setSelectedMovieTitle(data.title);

        if (Array.isArray(data)) {
          data = data[0];
        }

        if (!data || typeof data !== "object") {
          throw new Error("Dữ liệu phim không hợp lệ");
        }

        setMovie(data as MovieDetail);
      } catch (err: unknown) {
        try {
          const listRes = await fetch(
            "https://cinema-minio.onrender.com/movie",
            {
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          if (listRes.ok) {
            const listData: unknown = await listRes.json();
            const fromList = Array.isArray(listData)
              ? (listData as MovieDetail[]).find(
                  (item) =>
                    item?.movie_id === numericId ||
                    (item as { id?: number })?.id === numericId
                )
              : null;

            if (fromList) {
              setMovie(fromList as MovieDetail);
              setError(null);
              return;
            }
          }
        } catch (fallbackError: unknown) {
          console.error("Fallback fetch movie list failed:", fallbackError);
        }

        setMovie(null);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tải dữ liệu phim";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const heroTitle = useMemo(() => {
    if (loading) return "Đang tải thông tin phim...";
    if (error) return "Không thể tải phim";
    return movie?.title || "Chi tiết phim";
  }, [loading, error, movie]);

  const heroDescription = useMemo(() => {
    if (loading)
      return "Vui lòng chờ trong giây lát, chúng tôi đang tải dữ liệu phim.";
    if (error) return error;
    return movie
      ? `${movie.genre} • ${movie.duration} phút • ${movie.language}`
      : "Chọn một phim từ danh sách để xem chi tiết.";
  }, [loading, error, movie]);

  const castList = useMemo(() => {
    if (!movie?.cast) return [];
    const raw = Array.isArray(movie.cast)
      ? movie.cast
      : String(movie.cast)
          .split(",")
          .map((item) => item.trim());
    return raw.filter(Boolean);
  }, [movie]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await fetch("https://cinema-minio.onrender.com/cinema", {
          cache: "force-cache",
        });
        if (!res.ok) return;
        const data: Cinema[] = await res.json();

        const map = data.reduce<Record<number, Cinema>>((acc, item) => {
          acc[item.cinema_id] = item;
          return acc;
        }, {});
        setCinemaMap(map);

        const cinemaList = data.sort((a, b) =>
          a.name.localeCompare(b.name, "vi")
        );
        setCinemas(cinemaList);

        // --- THAY ĐỔI: Đã xóa logic tự động chọn rạp đầu tiên (setSelectedCinemaId) khỏi đây ---
      } catch (err) {
        console.error("Failed to fetch cinemas:", err);
      }
    };

    fetchCinemas();
  }, []); // Chỉ chạy một lần

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movieId) {
        setShowtimes([]);
        return;
      }

      const numericId = Number(movieId);
      if (Number.isNaN(numericId)) {
        setShowtimes([]);
        setShowtimesError("Mã phim không hợp lệ.");
        return;
      }

      setShowtimesLoading(true);
      setShowtimesError(null);

      try {
        const res = await fetch(
          `https://cinema-minio.onrender.com/showtimes/movie?movie=${numericId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Không tìm thấy lịch chiếu cho phim này.");
        }

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu lịch chiếu không hợp lệ.");
        }

        setShowtimes(data as Showtime[]);
      } catch (err) {
        console.error("Failed to fetch showtimes:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tải lịch chiếu.";
        setShowtimes([]);
        setShowtimesError(message);
      } finally {
        setShowtimesLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const dateTabs = useMemo(() => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    const apiFormatter = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        id: i,
        label: i === 0 ? "Hôm nay" : formatter.format(date),
        value: apiFormatter.format(date),
        date,
      };
    });
  }, []);

  const roomSchedules = useMemo(() => {
    if (!showtimes.length) return [];

    const normalizeDate = (value: string | undefined | null) => {
      if (!value)
        return {
          dateLabel: "Không xác định",
          timeLabel: "N/A",
          apiDate: "N/A",
        };

      const slashParts = value.split(" ");
      if (slashParts.length === 2 && slashParts[0].includes("/")) {
        const [datePart, timePart] = slashParts;
        const [day, month, year] = datePart.split("/");
        if (day && month && year) {
          const normalized = `${year}-${month}-${day}T${timePart}`;
          const parsed = new Date(normalized);
          if (!Number.isNaN(parsed.getTime())) {
            return {
              dateLabel: parsed.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              timeLabel: parsed.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              apiDate: parsed.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            };
          }
        }
      }

      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return {
          dateLabel: parsed.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          timeLabel: parsed.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          apiDate: parsed.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        };
      }

      if (
        value.includes(":") &&
        !value.includes("T") &&
        !value.includes("/") &&
        !value.includes(" ")
      ) {
        const timeOnly = value.split(":").slice(0, 2).join(":"); // Lấy "HH:mm"
        return {
          dateLabel: "Không xác định", // Không biết ngày
          timeLabel: timeOnly,
          apiDate: "N/A", // Không biết ngày
        };
      }

      return {
        dateLabel: "Không xác định",
        timeLabel: "N/A",
        apiDate: "N/A",
      };
    };

    const map = new Map<number, RoomSchedule>();

    showtimes.forEach((showtime) => {
      const roomId = showtime.room?.room_id ?? showtime.room_id;
      if (!roomId) return;

      const roomName =
        showtime.room?.name ||
        (showtime as unknown as { room_name?: string })?.room_name ||
        `Phòng ${roomId}`;

      const cinemaId =
        showtime.room?.cinema?.cinema_id ?? showtime.cinema_id ?? null;
      const cinemaInfo = cinemaId ? cinemaMap[cinemaId] : undefined;

      if (!map.has(roomId)) {
        map.set(roomId, {
          room_id: roomId,
          roomName,
          cinema_id: cinemaId ?? -1,
          cinemaName: cinemaInfo?.name ?? "Rạp không xác định",
          cinemaAddress:
            cinemaInfo?.address ??
            (showtime as unknown as { cinema_address?: string })
              ?.cinema_address ??
            "Đang cập nhật",
          sessions: {},
        });
      }

      const roomEntry = map.get(roomId);
      if (!roomEntry) return;

      const {
        dateLabel,
        timeLabel: startTime,
        apiDate,
      } = normalizeDate(showtime.start_time);

      let endTime: string | null = null;
      if (showtime.end_time) {
        const { timeLabel } = normalizeDate(showtime.end_time);
        if (timeLabel !== "N/A") {
          endTime = timeLabel;
        }
      }

      const displayTime =
        endTime && endTime !== startTime
          ? `${startTime} ~ ${endTime}`
          : startTime;

      const sessionKey = apiDate || dateLabel;

      if (!roomEntry.sessions[sessionKey]) {
        roomEntry.sessions[sessionKey] = {
          dateLabel,
          apiDate: apiDate || dateLabel,
          timeSlots: [],
        };
      }

      roomEntry.sessions[sessionKey].timeSlots.push({
        time: displayTime,
        showtimeId: showtime.showtime_id,
      });
    });

    return Array.from(map.values()).map<GroupedShowtimes>((item) => ({
      room_id: item.room_id,
      roomName: item.roomName,
      cinema_id: item.cinema_id,
      cinemaName: item.cinemaName,
      cinemaAddress: item.cinemaAddress,
      sessions: Object.entries(item.sessions)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB, "vi"))
        .map(([apiDate, session]) => ({
          apiDate,
          dateLabel: session.dateLabel,
          timeSlots: session.timeSlots.sort((a, b) =>
            a.time.localeCompare(b.time, "vi")
          ),
        })),
    }));
  }, [showtimes, cinemaMap]);

  // --- THAY ĐỔI: Thêm useMemo để lấy rạp CÓ LỊCH CHIẾU ---
  const availableCinemas = useMemo(() => {
    if (!roomSchedules.length) return [];
    // Lấy ID của các rạp có trong lịch chiếu (roomSchedules)
    const availableCinemaIds = new Set<number>(
      roomSchedules.map((room) => room.cinema_id)
    );
    // Lọc danh sách rạp master (cinemas)
    return cinemas.filter((cinema) => availableCinemaIds.has(cinema.cinema_id));
  }, [roomSchedules, cinemas]);

  // --- THAY ĐỔI: Thay thế useMemo của filteredCinemas bằng useEffect để quản lý cả state ---
  useEffect(() => {
    // Bước 1: Lọc danh sách rạp CÓ LỊCH CHIẾU (availableCinemas) bằng từ khóa tìm kiếm
    const keyword = searchKeyword.trim().toLowerCase();
    const nextList = keyword
      ? availableCinemas.filter(
          (cinema) =>
            cinema.name.toLowerCase().includes(keyword) ||
            cinema.address.toLowerCase().includes(keyword)
        )
      : availableCinemas;

    setFilteredCinemas(nextList); // Cập nhật state cho UI

    // Bước 2: Quản lý rạp đang được chọn (selectedCinemaId)
    const isSelectedCinemaInList = nextList.some(
      (cinema) => cinema.cinema_id === selectedCinemaId
    );

    if (nextList.length > 0) {
      if (!selectedCinemaId || !isSelectedCinemaInList) {
        // Nếu chưa chọn rạp nào, HOẶC rạp đang chọn không còn trong danh sách lọc
        // -> Tự động chọn rạp đầu tiên của danh sách mới
        setSelectedCinemaId(nextList[0].cinema_id);
      }
      // Ngược lại: rạp đang chọn vẫn trong danh sách -> giữ nguyên
    } else {
      // Nếu danh sách lọc rỗng (không tìm thấy kết quả)
      // -> Xóa rạp đang chọn
      setSelectedCinemaId(null);
    }
  }, [availableCinemas, searchKeyword, selectedCinemaId]);

  const filteredSchedule = useMemo(() => {
    if (!roomSchedules.length) return [];

    const selectedDateValue = dateTabs[selectedDateIndex]?.value;

    return (
      roomSchedules
        // Lọc theo rạp đã chọn (selectedCinemaId)
        .filter((room) =>
          selectedCinemaId ? room.cinema_id === selectedCinemaId : true
        )
        .map((room) => {
          // Lọc session (suất chiếu) theo ngày đã chọn
          const sessions = room.sessions.filter((session) => {
            if (!selectedDateValue) return true;
            return session.apiDate === selectedDateValue;
          });

          return {
            ...room,
            sessions,
          };
        })
        // Lọc ra các phòng không có suất chiếu vào ngày đã chọn
        .filter((room) => room.sessions.length > 0)
    );
  }, [roomSchedules, selectedCinemaId, selectedDateIndex, dateTabs]);

  return (
    <>
      <HeroSub title={heroTitle} description={heroDescription} badge="Movies" />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {!movieId && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
            Vui lòng chọn một phim từ trang danh sách để xem chi tiết.
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && movie && (
          <>
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-[600px] md:h-[550px] overflow-hidden">
              {movie.trailer_url ? (
                <>
                  <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src={movie.trailer_url}
                    title={`Trailer ${movie.title}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/45 z-10"></div>
                </>
              ) : (
                <img
                  src={movie.image_url}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/1200x550/e2e8f0/64748b?text=Image+Not+Found")
                  }
                />
              )}
              <div className="absolute bottom-6 left-4 md:left-12 flex items-end gap-6 z-20">
                <div className="relative w-24 h-36 md:w-56 md:h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-white/80">
                  <img
                    src={movie.image_url}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/224x288/e2e8f0/64748b?text=Poster")
                    }
                  />
                </div>
                <div className="max-w-xl space-y-2 rounded-xl bg-black/40 px-4 py-3 text-white shadow-lg backdrop-blur-sm border border-white/10">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {movie.title}
                  </h2>
                  <p className="text-white/80">
                    Khởi chiếu:{" "}
                    {new Date(movie.release_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Giới thiệu
                </h3>
                <p className="text-gray-600 leading-7">{movie.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">🎭 Thể loại:</span>{" "}
                    {movie.genre}
                  </p>
                  <p>
                    <span className="font-medium">🗣 Ngôn ngữ:</span>{" "}
                    {movie.language}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">🕒 Thời lượng:</span>{" "}
                    {movie.duration} phút
                  </p>
                  <p>
                    <span className="font-medium">📅 Khởi chiếu:</span>{" "}
                    {new Date(movie.release_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {(movie.director ||
                movie.country ||
                movie.age_rating ||
                movie.format ||
                typeof movie.imdb_rating === "number") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-5">
                  {movie.director && (
                    <div>
                      <p className="text-sm uppercase text-gray-500">
                        Đạo diễn
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {movie.director}
                      </p>
                    </div>
                  )}
                  {movie.country && (
                    <div>
                      <p className="text-sm uppercase text-gray-500">
                        Quốc gia
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {movie.country}
                      </p>
                    </div>
                  )}
                  {movie.age_rating && (
                    <div>
                      <p className="text-sm uppercase text-gray-500">
                        Giới hạn độ tuổi
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {movie.age_rating}
                      </p>
                    </div>
                  )}
                  {movie.format && (
                    <div>
                      <p className="text-sm uppercase text-gray-500">
                        Định dạng
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {movie.format}
                      </p>
                    </div>
                  )}
                  {typeof movie.imdb_rating === "number" && (
                    <div>
                      <p className="text-sm uppercase text-gray-500">
                        Đánh giá IMDB
                      </p>
                      <p className="text-base text-gray-800 font-medium">
                        {movie.imdb_rating.toFixed(1)} / 10
                      </p>
                    </div>
                  )}
                </div>
              )}

              {castList.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Diễn viên
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {castList.map((actor, index) => (
                      <span
                        key={`${actor}-${index}`}
                        className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Lịch đặt phòng
                  </h4>
                  {showtimesLoading && (
                    <div className="text-sm text-pink-600 animate-pulse">
                      Đang tải lịch chiếu...
                    </div>
                  )}
                </div>

                {showtimesError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {showtimesError}
                  </div>
                )}

                {/* --- THAY ĐỔI: Cập nhật điều kiện kiểm tra --- */}
                {!showtimesLoading &&
                  !showtimesError &&
                  showtimes.length > 0 && // Kiểm tra xem có showtimes không
                  availableCinemas.length === 0 && ( // MỚI: Kiểm tra rạp CÓ LỊCH CHIẾU
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      Hiện chưa có lịch chiếu cho rạp này.
                    </div>
                  )}

                {!showtimesLoading &&
                  !showtimesError &&
                  showtimes.length === 0 && ( // MỚI: Nếu không có showtimes nào
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      Phim này hiện chưa có lịch chiếu.
                    </div>
                  )}

                {/* --- THAY ĐỔI: Cột trái (Sidebar Rạp) --- */}
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="md:w-1/3 space-y-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">
                        Rạp chiếu
                      </h5>
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm rạp hoặc địa chỉ..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm max-h-[320px] overflow-y-auto space-y-2">
                      {/* --- THAY ĐỔI: Thông báo khi không có rạp nào có lịch chiếu --- */}
                      {!showtimesLoading && availableCinemas.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                          Không có rạp nào có lịch chiếu cho phim này.
                        </div>
                      ) : // --- THAY ĐỔI: Thông báo khi tìm kiếm không thấy
                      filteredCinemas.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                          Không tìm thấy rạp phù hợp.
                        </div>
                      ) : (
                        // Lặp qua danh sách rạp ĐÃ LỌC (filteredCinemas)
                        filteredCinemas.map((cinema) => (
                          <button
                            key={cinema.cinema_id}
                            onClick={() =>
                              setSelectedCinemaId(cinema.cinema_id)
                            }
                            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                              selectedCinemaId === cinema.cinema_id
                                ? "border-pink-400 bg-pink-50 text-pink-600 shadow"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium">{cinema.name}</div>
                            <div className="text-xs text-gray-500">
                              {cinema.address}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* --- Cột phải (Lịch chiếu) --- */}
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {dateTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedDateIndex(tab.id)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            selectedDateIndex === tab.id
                              ? "border-pink-500 bg-pink-500 text-white shadow"
                              : "border-gray-200 bg-white hover:border-pink-300 hover:text-pink-600"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* --- THAY ĐỔI: Thông báo khi có rạp nhưng không có lịch chiếu cho NGÀY ĐÃ CHỌN --- */}
                    {!showtimesLoading &&
                      availableCinemas.length > 0 &&
                      filteredSchedule.length === 0 && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                          Không có lịch chiếu cho rạp này vào ngày đã chọn.
                        </div>
                      )}

                    {/* Vòng lặp này bây giờ hiển thị TẤT CẢ các phòng cho RẠP đã chọn */}
                    <div className="space-y-4">
                      {filteredSchedule.map((room) => (
                        <div
                          key={room.room_id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
                        >
                          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                            <div>
                              <h5 className="text-base font-semibold text-gray-800">
                                {room.roomName}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {room.cinemaName}
                              </p>
                            </div>
                            <span className="text-xs uppercase tracking-wide text-pink-600">
                              Lịch chiếu trong ngày
                            </span>
                          </div>

                          <div className="mt-4 space-y-3">
                            {room.sessions.map((session) => (
                              <div
                                key={session.dateLabel}
                                className="rounded-lg bg-white px-4 py-3 shadow-sm"
                              >
                                <div className="text-sm font-medium text-gray-700">
                                  {session.dateLabel}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {session.timeSlots.map((slot) => (
                                    <button
                                      key={slot.showtimeId}
                                      className="rounded-lg border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600 transition hover:bg-pink-100 hover:border-pink-300 cursor-pointer"
                                      onClick={() =>
                                        setModalInfo({
                                          roomName: room.roomName,
                                          cinemaName: room.cinemaName,
                                          cinemaAddress: room.cinemaAddress,
                                          dateLabel: session.dateLabel,
                                          time: slot.time,
                                          showtimeId: slot.showtimeId,
                                        })
                                      }
                                    >
                                      {slot.time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {modalInfo && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalInfo(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalInfo(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              aria-label="Đóng"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h4 className="text-xl font-semibold text-pink-600 mb-5">
              Thông tin Suất chiếu
            </h4>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Phòng:
                </span>{" "}
                <span className="font-semibold">{modalInfo.roomName}</span>
              </p>
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Rạp:
                </span>{" "}
                {modalInfo.cinemaName}
              </p>
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Địa chỉ:
                </span>{" "}
                {modalInfo.cinemaAddress}
              </p>
              <hr className="my-3" />
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Ngày:
                </span>{" "}
                {modalInfo.dateLabel}
              </p>
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Giờ:
                </span>{" "}
                <span className="text-lg font-bold text-pink-600">
                  {modalInfo.time}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-500 w-20 inline-block">
                  Mã suất:
                </span>{" "}
                <span className="text-sm font-mono text-gray-600">
                  {modalInfo.showtimeId}
                </span>
              </p>
            </div>

            <button
              className="mt-6 w-full bg-pink-600 text-white font-medium py-3 rounded-lg hover:bg-pink-700 transition"
              onClick={() => {
                setSelectedShowtimeId(modalInfo.showtimeId);
                setSelectedShowtimeLabel(modalInfo.time);
              }}
            >
              Tiếp tục Đặt vé
            </button>
          </div>
        </div>
      )}
      {selectedShowtimeId && (
        <SeatSelectionModal
          showtimeId={selectedShowtimeId}
          movieTitle={selectedMovieTitle}
          showtime={selectedShowtimeLabel}
          onClose={() => setSelectedShowtimeId(null)}
        />
      )}
    </>
  );
}
