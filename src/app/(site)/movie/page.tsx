"use client";

// Đã xoá các import của Next.js và path alias không được hỗ trợ
// import HeroSub from "@/components/shared/HeroSub";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
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

type RoomOption = {
  room_id: number;
  roomName: string;
  cinema_id: number;
  cinemaName: string;
  cinemaAddress: string;
};

type RoomSchedule = {
  room_id: number;
  roomName: string;
  cinemaName: string;
  cinemaAddress: string;
  sessions: Record<
    string,
    {
      dateLabel: string;
      apiDate: string;
      timeSlots: string[];
    }
  >;
};

type GroupedShowtimes = {
  room_id: number;
  roomName: string;
  cinemaName: string;
  cinemaAddress: string;
  sessions: {
    dateLabel: string;
    apiDate: string;
    timeSlots: string[];
  }[];
};

// Component HeroSub thay thế (vì import gốc bị lỗi)
const HeroSub = ({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) => (
  <header className="bg-gray-100 py-12">
    <div className="max-w-6xl mx-auto px-6">
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
  // Thay thế `useSearchParams` bằng cách đọc `window.location.search`
  const [movieId, setMovieId] = useState<string | null>(null);

  useEffect(() => {
    // Logic này chỉ chạy trên client-side sau khi component được mount
    // Nó đọc `movieId` từ URL query string.
    const params = new URLSearchParams(window.location.search);
    const id = params.get("movieId");
    setMovieId(id);
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy một lần khi mount

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);
  const [cinemaMap, setCinemaMap] = useState<Record<number, Cinema>>({});
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

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
            `https://cinema-booking-l32q.onrender.com/movie/${numericId}`,
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

        // Một số API trả về mảng thay vì object, xử lý fallback
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
            "https://cinema-booking-l32q.onrender.com/movie",
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
                    // fallback trong trường hợp API trả về key khác
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

    // useEffect này sẽ tự động chạy lại khi `movieId` thay đổi
    // (từ null sang giá trị được đọc từ URL)
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
        const res = await fetch(
          "https://cinema-booking-l32q.onrender.com/cinema",
          {
            cache: "force-cache",
          }
        );
        if (!res.ok) return;
        const data: Cinema[] = await res.json();
        const map = data.reduce<Record<number, Cinema>>((acc, item) => {
          acc[item.cinema_id] = item;
          return acc;
        }, {});
        setCinemaMap(map);
      } catch (err) {
        console.error("Failed to fetch cinemas:", err);
      }
    };

    fetchCinemas();
  }, []);

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
        // -----------------------------------------------------------------
        // SỬA Ở ĐÂY:
        // Đã thay đổi URL từ `http://localhost:3001/showtimes...`
        // sang API route nội bộ của Next.js: `/api/showtimes...`
        // (Giữ nguyên từ lần sửa trước, phần này đã đúng)
        // -----------------------------------------------------------------
        const res = await fetch(
          `https://cinema-booking-l32q.onrender.com/showtimes?movie=${numericId}`,
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

  useEffect(() => {
    if (!showtimes.length) {
      setRooms([]);
      setSelectedRoomId(null);
      return;
    }

    const roomMap = new Map<number, RoomOption>();

    showtimes.forEach((showtime) => {
      const cinemaId =
        showtime.room?.cinema?.cinema_id ?? showtime.cinema_id ?? null;
      const cinemaInfo = cinemaId ? cinemaMap[cinemaId] : undefined;

      const roomId = showtime.room?.room_id ?? showtime.room_id;
      const roomName =
        showtime.room?.name ||
        (showtime as unknown as { room_name?: string })?.room_name ||
        `Phòng ${roomId ?? showtime.showtime_id}`;

      if (!roomId || roomMap.has(roomId)) return;

      roomMap.set(roomId, {
        room_id: roomId,
        roomName,
        cinema_id: cinemaId ?? -1,
        cinemaName: cinemaInfo?.name ?? "Rạp không xác định",
        cinemaAddress:
          cinemaInfo?.address ??
          (showtime as unknown as { cinema_address?: string })
            ?.cinema_address ??
          "Đang cập nhật",
      });
    });

    const roomList = Array.from(roomMap.values()).sort((a, b) => {
      if (a.cinemaName !== b.cinemaName) {
        return a.cinemaName.localeCompare(b.cinemaName, "vi");
      }
      return a.roomName.localeCompare(b.roomName, "vi");
    });

    setRooms(roomList);

    setSelectedRoomId((prev) => {
      if (prev && roomList.some((room) => room.room_id === prev)) {
        return prev;
      }
      return roomList.length > 0 ? roomList[0].room_id : null;
    });
  }, [showtimes, cinemaMap]);

  const filteredRooms = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return rooms;
    return rooms.filter(
      (room) =>
        room.roomName.toLowerCase().includes(keyword) ||
        room.cinemaName.toLowerCase().includes(keyword)
    );
  }, [rooms, searchKeyword]);

  const roomSchedules = useMemo(() => {
    if (!showtimes.length) return [];

    const normalizeDate = (value: string) => {
      if (!value) return { dateLabel: "Không xác định", timeLabel: "N/A" };

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

      return {
        dateLabel: "Không xác định",
        timeLabel: value,
        apiDate: value,
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

      const { dateLabel, timeLabel, apiDate } = normalizeDate(
        showtime.start_time
      );
      const sessionKey = apiDate || dateLabel;

      if (!roomEntry.sessions[sessionKey]) {
        roomEntry.sessions[sessionKey] = {
          dateLabel,
          apiDate: apiDate || dateLabel,
          timeSlots: [],
        };
      }

      roomEntry.sessions[sessionKey].timeSlots.push(timeLabel);
    });

    return Array.from(map.values()).map<GroupedShowtimes>((item) => ({
      room_id: item.room_id,
      roomName: item.roomName,
      cinemaName: item.cinemaName,
      cinemaAddress: item.cinemaAddress,
      sessions: Object.entries(item.sessions)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB, "vi"))
        .map(([apiDate, session]) => ({
          apiDate,
          dateLabel: session.dateLabel,
          timeSlots: session.timeSlots.sort((a, b) => a.localeCompare(b, "vi")),
        })),
    }));
  }, [showtimes, cinemaMap]);

  const filteredSchedule = useMemo(() => {
    if (!roomSchedules.length) return [];

    const selectedDateValue = dateTabs[selectedDateIndex]?.value;

    return roomSchedules
      .filter((room) =>
        selectedRoomId ? room.room_id === selectedRoomId : true
      )
      .map((room) => {
        const sessions = room.sessions.filter((session) => {
          if (!selectedDateValue) return true;
          return session.apiDate === selectedDateValue;
        });

        return {
          ...room,
          sessions,
        };
      })
      .filter((room) => room.sessions.length > 0);
  }, [roomSchedules, selectedRoomId, selectedDateIndex, dateTabs]);

  return (
    <>
      {/* Đã thay thế <HeroSub> bằng component nội bộ */}
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
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-[400px] md:h-[550px] overflow-hidden">
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
                // Đã thay thế <Image> bằng <img>
                <img
                  src={movie.image_url}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  // Thêm fallback
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/1200x550/e2e8f0/64748b?text=Image+Not+Found")
                  }
                />
              )}
              <div className="absolute bottom-6 left-4 md:left-12 flex items-end gap-6 z-20">
                <div className="relative w-24 h-36 md:w-56 md:h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-white/80">
                  {/* Đã thay thế <Image> bằng <img> */}
                  <img
                    src={movie.image_url}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    // Thêm fallback
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

                {!showtimesLoading &&
                  !showtimesError &&
                  filteredSchedule.length === 0 && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      Hiện chưa có lịch chiếu cho ngày này. Vui lòng chọn ngày
                      khác.
                    </div>
                  )}

                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="md:w-1/3 space-y-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">
                        Phòng chiếu
                      </h5>
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm phòng hoặc rạp..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                      />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm max-h-[320px] overflow-y-auto space-y-2">
                      {filteredRooms.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                          Không tìm thấy phòng phù hợp.
                        </div>
                      ) : (
                        filteredRooms.map((room) => (
                          <button
                            key={room.room_id}
                            onClick={() => setSelectedRoomId(room.room_id)}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                              selectedRoomId === room.room_id
                                ? "border-pink-400 bg-pink-50 text-pink-600 shadow"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium">{room.roomName}</div>
                            <div className="text-xs text-gray-500">
                              {room.cinemaName}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {room.cinemaAddress}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

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
                                  {session.timeSlots.map((time) => (
                                    <span
                                      key={`${session.dateLabel}-${time}`}
                                      className="rounded-lg border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600"
                                    >
                                      {time}
                                    </span>
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
    </>
  );
}
