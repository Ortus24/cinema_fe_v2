import Link from "next/link";
import { Icon } from "@iconify/react";
import { FooterLinks } from "@/app/api/footerlinks";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-300 pt-12">
      <div className="container mx-auto max-w-7xl px-6">
        {/* ==== Phần trên: Logo + các cột thông tin ==== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-700">
          {/* Cột 1 - Giới thiệu */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Cinema Booking
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng đặt vé xem phim nhanh chóng, tiện lợi và bảo mật. Trải
              nghiệm điện ảnh đỉnh cao cùng chúng tôi 🎬
            </p>
          </div>

          {/* Cột 2 - Liên kết nhanh */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Tài nguyên
            </h4>
            <ul className="space-y-2">
              {/* {FooterLinks.slice(0, 4).map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))} */}

              <Link
                href={"documentation"}
                className="hover:text-primary transition-colors"
              >
                Tài liệu phát triển
              </Link>
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ khách hàng */}
          <div>
            {/* <h4 className="text-lg font-semibold text-white mb-4">
              Hỗ trợ khách hàng
            </h4> */}
            <ul className="space-y-2">
              {FooterLinks.slice(4, 8).map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4 - Liên hệ */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <p className="text-sm">
              Tác giả:{" "}
              <span className="font-semibold text-white">Nguyễn Long Nhật</span>
            </p>
            <p className="text-sm">
              Email:{" "}
              <a
                href="mailto:nhatlckbt007@gmail.com"
                className="text-primary hover:underline"
              >
                nhatlckbt007@gmail.com
              </a>
            </p>

            <div className="flex gap-4 mt-4">
              <Link
                href="https://www.facebook.com/share/17STh3GC17/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  icon="ph:facebook-logo-fill"
                  width={24}
                  height={24}
                  className="hover:text-primary transition-colors"
                />
              </Link>
              {/* <Link href="#">
                <Icon
                  icon="ph:instagram-logo-fill"
                  width={24}
                  height={24}
                  className="hover:text-primary transition-colors"
                />
              </Link>
              <Link href="#">
                <Icon
                  icon="ph:x-logo-bold"
                  width={24}
                  height={24}
                  className="hover:text-primary transition-colors"
                />
              </Link> */}
              <Link
                href="https://github.com/Ortus24/cinema_fe_v2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  icon="mdi:github"
                  width={24}
                  height={24}
                  className="hover:text-primary transition-colors"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ==== Phần giữa: Form đăng ký nhận tin ==== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-10 border-b border-gray-700">
          <p className="text-gray-400 text-sm text-center md:text-left">
            Nhận thông tin phim mới và ưu đãi đặc biệt qua email 📩
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="rounded-l-full py-3 px-5 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none w-64"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-r-full font-semibold hover:bg-white hover:text-dark transition">
              Đăng ký
            </button>
          </div>
        </div>

        {/* ==== Phần cuối: Bản quyền ==== */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} CineBooking — Thiết kế & phát triển bởi{" "}
            <span className="text-white font-semibold">Nguyễn Long Nhật</span>
          </p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
