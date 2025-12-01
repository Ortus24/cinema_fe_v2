import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us | Homely",
};

export default function ContactUs() {
  return (
    <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
      <div className="mb-16">
        <div className="flex gap-2.5 items-center justify-center mb-3">
          <span>
            <Icon
              icon={"ph:house-simple-fill"}
              width={20}
              height={20}
              className="text-primary"
            />
          </span>
          <p className="text-base font-semibold text-badge dark:text-white/90">
            Liên hệ chúng tôi
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14">
            Bạn có thắc mắc? Sẵn sàng giúp đỡ!
          </h3>
          <p className="text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6">
            Bất cứ ý kiến đóng góp mà bạn muốn gửi đến tôi để sửa đổi và phát
            triển làm cho trải nghiệm của bạn trở lên tốt hơn!
          </p>
        </div>
      </div>
      {/* form */}
      <div className="border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="relative w-fit">
            <Image
              src={"/images/contactUs/contactUs.jpg"}
              alt="wall"
              width={497}
              height={535}
              className="rounded-2xl brightness-50 h-full"
              unoptimized={true}
            />
            <div className="absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2">
              <h5 className="text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white">
                Thông tin liên hệ
              </h5>
              <p className="text-sm xs:text-base mobile:text-xm font-normal text-white/80">
                Hãy điền ý kiến của bạn vào đây! Chúng tôi luôn sẵn sàng hỗi
                trợ!!!
              </p>
            </div>
            <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white">
              <Link href={"/"} className="w-fit">
                <div className="flex items-center gap-4 group w-fit">
                  <Icon icon={"ph:phone"} width={32} height={32} />
                  <p className="text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary">
                    +84 369 880 798
                  </p>
                </div>
              </Link>
              <Link href={"/"} className="w-fit">
                <div className="flex items-center gap-4 group w-fit">
                  <Icon icon={"ph:envelope-simple"} width={32} height={32} />
                  <p className="text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary">
                    nhatlckbt007@gmail.com
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <Icon icon={"ph:map-pin"} width={32} height={32} />
                <p className="text-sm xs:text-base mobile:text-xm font-normal">
                  Hà Nội, Việt Nam
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1/2">
            <form>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    placeholder="Họ và tên*"
                    required
                    className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full"
                  />
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    autoComplete="mobile"
                    placeholder="Số điện thoại*"
                    required
                    className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Email*"
                  required
                  className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline"
                />
                <textarea
                  rows={8}
                  cols={50}
                  name="message"
                  id="message"
                  placeholder="Viết đóng góp ở đây..."
                  required
                  className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-2xl outline-primary focus:outline"
                ></textarea>
                <button className="px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300">
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
