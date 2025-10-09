"use client";

import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  const scrollToSchedule = () => {
    const section = document.getElementById("schedule-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="!py-0">
      <div className="bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative">
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68">
          <div className="relative text-white dark:text-dark text-center md:text-start z-10">
            <p className="text-inherit text-xm font-medium">Thuy KHUE, HN</p>
            <h1 className="text-inherit text-6xl sm:text-9xl font-semibold -tracking-wider md:max-w-45p mt-4 mb-6">
              Nhật Booking
            </h1>
            <div className="flex flex-col xs:flex-row justify-center md:justify-start gap-4">
              <Link
                href="/contactus"
                className="px-8 py-4 border border-white dark:border-dark bg-white dark:bg-dark text-dark dark:text-white duration-300 dark:hover:text-dark hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer"
              >
                Góp ý đến chúng tôi
              </Link>
              <button
                onClick={scrollToSchedule}
                className="px-8 py-4 border border-white dark:border-dark bg-transparent text-white dark:text-dark hover:bg-white dark:hover:bg-dark dark:hover:text-white hover:text-dark duration-300 text-base font-semibold rounded-full hover:cursor-pointer"
              >
                Lịch chiếu
              </button>
            </div>
          </div>
          <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2">
            <Image
              src={"/images/hero/movie.png"}
              alt="heroImg"
              width={400}
              height={400}
              priority={false}
              unoptimized={true}
            />
          </div>
        </div>
        <div className="md:absolute bottom-0 md:-right-68 xl:right-0 bg-white dark:bg-black py-12 px-8 mobile:px-16 md:pl-16 md:pr-[295px] rounded-2xl md:rounded-none md:rounded-tl-2xl mt-24">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:flex gap-16 md:gap-24 sm:text-center dark:text-white text-black">
            <div className="flex flex-col sm:items-center gap-3">
              <Image
                src={"/images/hero/cinema.png"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/cinema.png"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm sm:text-base font-normal text-inherit">
                21 Movie
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <Image
                src={"/images/hero/room.png"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/room.png"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm sm:text-base font-normal text-inherit">
                4 Room
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <Image
                src={"/images/hero/building.png"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/buildng.png"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm sm:text-base font-normal text-inherit">
                2 Cinema
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <p className="text-2xl sm:text-3xl font-medium text-inherit">
                $4,750,000
              </p>
              <p className="text-sm sm:text-base font-normal text-black/50 dark:text-white/50">
                For selling price
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
