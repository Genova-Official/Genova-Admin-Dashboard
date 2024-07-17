"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaSignOutAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { sideData } from "./data";
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { BsListColumnsReverse } from "react-icons/bs";
import { RiUserSettingsLine } from "react-icons/ri";
import Support from "@/components/icons/Support";
import Logout from "@/components/icons/Logout";
import BottomNav from "./BottomNav";
import useCustomLogout from "@/hooks/useCustomLogout";

const iconMap = {
  home: RxDashboard,
  customer: GoPerson,
  transaction: BsListColumnsReverse,
  settings: RiUserSettingsLine,
  support: Support,
  logout: FaSignOutAlt,
};

export default function SideNav({ ...props }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const customLogout = useCustomLogout();

  useEffect(() => {
    if (typeof window === 'undefined') {
    return null
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as per your design
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSetActive = (itemLink) => {
    setActiveItem(itemLink);
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  if (isMobile) {
    return <BottomNav />;
  }

  return (
    <menu
      {...props}
      className={`flex flex-col h-full p-6 flex-none shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <nav className="flex-grow flex flex-col gap-3">
        {sideData.map((item, idx) => {
          const IconComponent = iconMap[item.icon];
          const isActive = pathname === item.link;
          return (
            <Link key={idx} href={item.link}>
              <p
                className={`relative w-full font-poppins py-3 flex items-center gap-5 text-black transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-white p-2"
                    : "hover:text-accent hover:scale-95"
                }`}
                onClick={() => handleSetActive(item.link)}
              >
                {IconComponent && <IconComponent size={24} />}
                {isExpanded && <span>{item.title}</span>}
              </p>
            </Link>
          );
        })}
      </nav>
      <div className="flex justify-between items-center mb-6 animation-bounce">
        <button onClick={toggleSidebar} className={`flex text-lg w-full ${isExpanded ? "justify-end" : "justify-start"} `}>
          {!isExpanded ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <span
      onClick={customLogout}
        className={`py-3 mb-7 flex items-center gap-5 cursor-pointer font-poppins text-black hover:text-accent transition-all duration-200 hover:scale-95 ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
      >
        <Logout />
        {isExpanded && <span>Signout</span>}
      </span>
    </menu>
  );
}
