"use client";
import { navLinks } from "@/app/api/navlink";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import NavLink from "./Navigation/NavLink";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  const sideMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideMenuRef.current &&
      !sideMenuRef.current.contains(event.target as Node)
    ) {
      setNavbarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    // Handler for the storage event (i.e., successful login)
    const handleLoginSuccess = (event: StorageEvent) => {
      // We only care about the 'token' key being set.
      if (event.key === "token" && event.newValue) {
        setToken(event.newValue);
        toast.success("Đăng nhập thành công");
        router.push("/");
      }
    };

    // Set the initial token state on component mount
    const initialToken = localStorage.getItem("token");
    if (initialToken) {
      setToken(initialToken);
    }

    // Add other event listeners
    window.addEventListener("storage", handleLoginSuccess);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleLoginSuccess);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleScroll, router]); // Dependency array includes router and handleScroll

  //===================================================================
  //Kiểm tra xem đã đăng nhập chưa
  //==================================================================

  //===================================================================

  const isHomepage = pathname === "/";

  return (
    <header
      className={`fixed h-24 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${
        sticky ? "top-3" : "top-0"
      }`}
    >
      <nav
        className={`container mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${
          sticky
            ? "shadow-lg bg-white dark:bg-dark rounded-full top-5 px-4 "
            : "shadow-none top-0"
        }`}
      >
        <div className="flex justify-between items-center gap-2 w-full">
          <div>
            <Link href="/">
              <Image
                src={"/images/header/dark-logo.svg"}
                alt="logo"
                width={150}
                height={68}
                unoptimized={true}
                className={`${
                  isHomepage
                    ? sticky
                      ? "block dark:hidden"
                      : "hidden"
                    : sticky
                    ? "block dark:hidden"
                    : "block dark:hidden"
                }`}
              />
              <Image
                src={"/images/header/logo.svg"}
                alt="logo"
                width={150}
                height={68}
                unoptimized={true}
                className={`${
                  isHomepage
                    ? sticky
                      ? "hidden dark:block"
                      : "block"
                    : sticky
                    ? "dark:block hidden"
                    : "dark:block hidden"
                }`}
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className={`hidden md:block`}>
              <Link
                href="#"
                className={`text-base text-inherit flex items-center gap-2 border-r pr-6 ${
                  isHomepage
                    ? sticky
                      ? "text-dark dark:text-white hover:text-primary border-dark dark:border-white"
                      : "text-white hover:text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                <Icon icon={"ph:phone-bold"} width={24} height={24} />
                +84-369 880 798
              </Link>
            </div>
            <div>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${
                  isHomepage
                    ? sticky
                      ? "text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white"
                      : "text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white"
                    : "bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300"
                }`}
                aria-label="Toggle mobile menu"
              >
                <span>
                  <Icon icon={"ph:list"} width={24} height={24} />
                </span>
                <span className="hidden sm:block">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {navbarOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />
      )}

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        } z-50 px-20 overflow-auto no-scrollbar`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="">
            <div className="flex items-center justify-start py-10">
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label="Close mobile menu"
                className="bg-white p-3 rounded-full hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-start gap-4">
              <ul className="w-full">
                {navLinks.map((item, index) => (
                  <NavLink
                    key={index}
                    item={item}
                    onClick={() => setNavbarOpen(false)}
                  />
                ))}

                {token ? (
                  <li className="flex items-center gap-4">
                    <Link
                      href="/profile"
                      className="py-4 px-8 bg-transparent border border-primary text-base leading-4 block w-fit text-primary rounded-full font-semibold mt-3 hover:bg-primary hover:text-white duration-300"
                    >
                      Tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-4 px-8 bg-primary text-base leading-4 block
                      w-fit text-white rounded-full border border-primary
                      font-semibold mt-3 hover:bg-transparent hover:text-primary
                      duration-300"
                    >
                      Đăng xuất
                    </button>
                  </li>
                ) : (
                  <li className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setNavbarOpen(false);
                      }}
                    >
                      <Link
                        href="/signin"
                        className="py-4 px-8 bg-primary text-base leading-4 block w-fit text-white rounded-full border border-primary font-semibold mt-3 hover:bg-transparent hover:text-primary duration-300"
                      >
                        Đăng nhập
                      </Link>
                    </button>

                    <button
                      onClick={() => {
                        setNavbarOpen(false);
                      }}
                    >
                      <Link
                        href="/signup"
                        className="py-4 px-8 bg-transparent border border-primary text-base leading-4 block w-fit text-primary rounded-full font-semibold mt-3 hover:bg-primary hover:text-white duration-300"
                      >
                        Đăng ký
                      </Link>
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-1 my-16 text-white">
            <p className="text-base sm:text-xm font-normal text-white/40">
              Contact
            </p>
            <Link
              href="#"
              className="text-base sm:text-xm font-medium text-inherit hover:text-primary"
            >
              nhatlckbt007@gmail.com{" "}
            </Link>
            <Link
              href="#"
              className="text-base sm:text-xm font-medium text-inherit hover:text-primary"
            >
              +84-369 880 798{" "}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
