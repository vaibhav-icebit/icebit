"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoDark from "../../../public/assets/8.png";
import logoLight from "../../../public/assets/logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Services", path: "/services" },
    { title: "About", path: "/about" },
    { title: "FAQ", path: "/faq" },
  ];

  // Handle scroll event to set sticky state
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setSticky(offset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed w-full">
      <nav>
        <div
          className={`transition-all duration-500 ease-in-out  h-[70px] flex flex-wrap items-center justify-between  px-11 mx-auto bg-white bg-opacity-10 ${
            isSticky
              ? "bg-opacity-100 max-w-screen"
              : "max-w-screen-xl rounded-[150px] mt-3 bg-opacity-10"
          } `}
        >
          <Link href="/" className="flex items-center">
            {isSticky ? (
              <Image
                src={logoLight.src}
                width={100}
                height={50}
                alt="icebit-logo"
              />
            ) : (
              <Image
                src={logoDark.src}
                width={100}
                height={50}
                alt="icebit-logo"
              />
            )}
          </Link>
          <div className="flex gap-10" id="mobile-menu-2">
            <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {navLinks.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={item.path}
                        className={`font-bold ${
                          isSticky ? "" : "text-white"
                        } text-lg block py-2 pl-3 pr-4 bg-purple-700 rounded lg:bg-transparent white lg:p-0 hover:underline underline-offset-8 ${
                          pathname === item.path ? "underline" : ""
                        }`}
                        onClick={() => setMobileMenuOpen(false)} // Close menu on item click
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex items-center lg:order-2">
              <a
                href="/"
                className="text-white font-bold bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-[150px] text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
              >
                Conatct US
              </a>
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-[150px] lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
