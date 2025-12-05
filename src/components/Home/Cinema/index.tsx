"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import MovieCard from "../Properties/Card/MovieCard";

interface Movie {
  movie_id?: number;
  id?: number;
  title: string;
  duration: number;
  genre: string;
  language: string;
  release_date: string;
  description: string;
  image_url: string;
}

const CinemaListing: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchGenre, setSearchGenre] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/movie");
        const data = await res.json();
        setMovies(data);
        setFilteredMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter((movie) => {
      const matchesTitle = movie.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());
      const matchesGenre = searchGenre ? movie.genre === searchGenre : true;
      return matchesTitle && matchesGenre;
    });
    setFilteredMovies(filtered);
  }, [searchTitle, searchGenre, movies]);

  const uniqueGenres = Array.from(new Set(movies.map((m) => m.genre)));

  return (
    <section>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 items-center">
          <div className="flex gap-2.5 items-center justify-center">
            <Icon
              icon="ph:house-simple-fill"
              width={20}
              height={20}
              className="text-primary"
            />
            <p className="text-base font-semibold text-dark/75 dark:text-white/75">
              Movies
            </p>
          </div>
          <h2 className="text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2">
            🎬 Phim đang chiếu tại rạp
          </h2>
          <p className="text-xm font-normal text-black/50 dark:text-white/50 text-center">
            Danh sách phim mới nhất từ API
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Tìm theo tên phim..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />
          <select
            value={searchGenre}
            onChange={(e) => setSearchGenre(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          >
            <option value="">Tất cả thể loại</option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Grid layout */}
        {loading ? (
          <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="flex flex-col items-center justify-center gap-4 py-60">
              <div className="h-30 w-30 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              <h3 className="text-lg font-medium text-gray-600">Đang tải...</h3>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {filteredMovies.map((movie, index) => (
              <div key={index} className="w-full md:w-1/3 px-4 mb-8">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CinemaListing;
