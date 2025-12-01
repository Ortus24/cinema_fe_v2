"use client";

import { Icon } from "@iconify/react";

import { useState, useEffect } from "react";
import MovieCard from "./Card/MovieCard";

interface Movie {
  title: string;
  duration: number;
  genre: string;
  language: string;
  release_date: string;
  description: string;
  image_url: string;
}

const Properties: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  // Fetch API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3001/movie");
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Auto next
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (movies.length - itemsPerView + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (movies.length - itemsPerView + 1)) %
        (movies.length - itemsPerView + 1)
    );
  };

  return (
    <section>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-3">
          <div className="flex gap-2.5 items-center justify-center">
            <span>
              <Icon
                icon={"ph:house-simple-fill"}
                width={20}
                height={20}
                className="text-primary"
              />
            </span>
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

        {/* Carousel */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {movies.map((movie, index) => (
              <div
                key={index}
                className="px-4"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

export default Properties;
