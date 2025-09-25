import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const Categories = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-0 top-0">
        <Image
          src="/images/categories/Vector.svg"
          alt="vector"
          width={800}
          height={1050}
          className="dark:hidden"
          unoptimized={true}
        />
        <Image
          src="/images/categories/Vector-dark.svg"
          alt="vector"
          width={800}
          height={1050}
          className="hidden dark:block"
          unoptimized={true}
        />
      </div>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10">
        <div className="grid grid-cols-12 items-center gap-10">
          <div className="lg:col-span-6 col-span-12">
            <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2.5">
              <Icon
                icon="ph:house-simple-fill"
                className="text-2xl text-primary "
              />
              Best movie
            </p>
            <h2 className="lg:text-52 text-40 mt-4 mb-2 lg:max-w-full font-medium leading-[1.2] text-dark dark:text-white">
              Explore the top movies that are making waves right now.
            </h2>
            <p className="text-dark/50 dark:text-white/50 text-lg lg:max-w-full leading-[1.3] md:max-w-3/4">
              From action-packed blockbusters to heartwarming dramas, these are
              the films you can’t miss. Get your tickets now and be part of the
              excitement
            </p>
            <Link
              href="/properties"
              className="py-4 px-8 bg-primary text-base leading-4 block w-fit text-white rounded-full font-semibold mt-8 hover:bg-dark duration-300"
            >
              View properties
            </Link>
          </div>
          <div className="lg:col-span-6 col-span-12">
            <div className="relative rounded-2xl overflow-hidden group aspect-[3/2]">
              <Link href="/residential-homes">
                <Image
                  src="/images/categories/conan.jpg"
                  alt="villas"
                  width={680}
                  height={386}
                  className="w-full"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/residential-homes"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-10 pb-10 group-hover:top-0 duration-500"
              >
                <div className="flex justify-end mt-6 mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md max-w-xl mx-auto text-gray-900">
                    <h3 className="text-2xl font-semibold mb-4 text-center">
                      🎬 Thám Tử Lừng Danh Conan: Dư Ảnh Của Độc Nhãn
                    </h3>
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>
                        <strong>🕒 Thời lượng:</strong> 110 phút
                      </li>
                      <li>
                        <strong>📅 Khởi chiếu:</strong> Ngày 25/07/2025
                      </li>
                      <li>
                        <strong>🎭 Thể loại:</strong> Hoạt Hình, Bí ẩn, Hành
                        Động
                      </li>
                      <li>
                        <strong>🎬 Đạo diễn:</strong> Katsuya Shigehara
                      </li>
                      <li>
                        <strong>👥 Diễn viên:</strong> Show Hayami, Megumi
                        Hayashibara, Hiroaki Hirata,...
                      </li>
                      <li>
                        <strong>🗣 Ngôn ngữ:</strong> Tiếng Nhật - Phụ đề Tiếng
                        Việt
                      </li>
                      <li>
                        <strong>🔞 Độ tuổi:</strong> K - Dưới 13 tuổi cần đi
                        cùng người lớn
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 col-span-12">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/luxury-villa">
                <Image
                  src="/images/categories/640x396-muado_1.jpg"
                  alt="villas"
                  width={680}
                  height={500}
                  className="w-full"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/luxury-villa"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-10 pb-10 group-hover:top-0 duration-500"
              >
                <div className="flex justify-end mt-6 mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md max-w-xl mx-auto text-gray-900">
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>
                        <strong>📅 Ngày phát hành:</strong> 22 tháng 8, 2025
                        (Việt Nam)
                      </li>
                      <li>
                        <strong>🎬 Đạo diễn:</strong> Đặng Thái Huyền
                      </li>
                      <li>
                        <strong>🕒 Thời lượng:</strong> 2 giờ 4 phút
                      </li>
                      <li>
                        <strong>🎥 Quay phim:</strong> Lý Thái Dũng
                      </li>
                      <li>
                        <strong>🎼 Âm nhạc:</strong> Cao Đình Thắng
                      </li>
                      <li>
                        <strong>📝 Biên kịch:</strong> Chu Lai
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3 col-span-6">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/office-spaces">
                <Image
                  src="/images/categories/thanh-guom-diet-quy-17412472874981233436600.webp"
                  alt="office"
                  width={320}
                  height={386}
                  className="w-full"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/office-spaces"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between group-hover:top-0 duration-500"
              >
                <div className="flex justify-end mt-6 mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex justify-center items-center pb-10 px-4">
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md w-full max-w-xl text-gray-900">
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>
                        <strong>📅</strong> 15 tháng 8, 2025
                      </li>
                      <li>
                        <strong>🎬</strong> Haruo Sotozaki
                      </li>
                      <li>
                        <strong>🕒</strong> 2 giờ 35 phút
                      </li>
                      <li>
                        <strong>👥</strong> Hanae Natsuki, Kitō Akari, Matsuoka
                        Yoshitsugu, Shimono Hiro, Hayami Saori
                      </li>
                      <li>
                        <strong>🗣 Ngôn ngữ:</strong> Nhật
                      </li>
                      <li>
                        <strong>📺</strong> Demon Slayer: Kimetsu no Yaiba
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3 col-span-6">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/office-spaces">
                <Image
                  src="/images/categories/phim_viet_nam_chieu_rap_hay_1_1656a985dc.jpg"
                  alt="office"
                  width={320}
                  height={386}
                  className="w-full"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/office-spaces"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between group-hover:top-0 duration-500"
              >
                <div className="flex justify-end mt-6 mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex justify-center items-center pb-10 px-4">
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md w-full max-w-xl text-gray-900">
                    <ul className="space-y-2 text-base leading-relaxed">
                      <li>
                        <strong>📅</strong> 30 tháng 8, 2024
                      </li>
                      <li>
                        <strong>🎬</strong> Nguyễn Nhật Trung
                      </li>
                      <li>
                        <strong>🕒</strong> 1 giờ 53 phút
                      </li>
                      <li>
                        <strong>👥</strong> Hoài Linh, Tuấn Trần, Diệp Bảo Ngọc,
                        Lê Giang
                      </li>
                      <li>
                        <strong>🗣 Ngôn ngữ:</strong> Việt Nam
                      </li>
                      <li>
                        <strong>📺</strong> Gia đình, Hài
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
