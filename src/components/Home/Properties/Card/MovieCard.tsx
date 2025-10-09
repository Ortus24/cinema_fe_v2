import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

export interface Movie {
  title: string;
  duration: number;
  genre: string;
  language: string;
  release_date: string;
  description: string;
  image_url: string;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const {
    title,
    duration,
    genre,
    language,
    release_date,
    description,
    image_url,
  } = movie;

  return (
    <div className="relative rounded-2xl border border-dark/10 dark:border-white/10 group hover:shadow-2xl duration-300 dark:hover:shadow-white/20">
      {/* Poster */}
      <div className="overflow-hidden rounded-t-2xl">
        <Link href="#">
          <Image
            src={image_url}
            alt={title}
            width={440}
            height={300}
            className="w-full h-[250px] object-cover rounded-t-2xl group-hover:brightness-75 group-hover:scale-110 transition duration-300"
            unoptimized
          />
        </Link>
        <div className="absolute top-6 right-6 p-3 bg-white rounded-full hidden group-hover:block">
          <Icon
            icon="solar:arrow-right-linear"
            width={20}
            height={20}
            className="text-black"
          />
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-5 flex flex-col gap-3 w-[480px]">
        <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-primary transition truncate">
          {title}
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60 truncate">
          {description}
        </p>

        <div className="flex flex-col gap-1 text-sm text-black dark:text-white mt-2">
          <p>
            <strong>📅 Khởi chiếu:</strong>{" "}
            {new Date(release_date).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>🕒 Thời lượng:</strong> {duration} phút
          </p>
          <p>
            <strong>🎭 Thể loại:</strong> {genre}
          </p>
          <p>
            <strong>🗣 Ngôn ngữ:</strong> {language}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
