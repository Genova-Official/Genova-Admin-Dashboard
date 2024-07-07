"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { sideData } from './data';
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { BsListColumnsReverse } from "react-icons/bs";
import { RiUserSettingsLine } from "react-icons/ri";
import Support from '@/components/icons/Support';
import Logout from '@/components/icons/Logout';

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
  const [activeItem, setActiveItem] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as per your design
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSetActive = (itemLink) => {
    setActiveItem(itemLink);
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <menu {...props} className={`flex flex-col h-full p-6 flex-none shadow-lg transition-all duration-300 ${isExpanded && !isMobile ? 'w-64' : 'w-20'}`}>
      <div className="flex justify-between items-center mb-6">
        {!isMobile && (
          <button onClick={toggleSidebar} className="text-xl">
            {isExpanded ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>
      <nav className="flex-grow flex flex-col gap-3">
        {sideData.map((item, idx) => {
          const IconComponent = iconMap[item.icon];
          const isActive = pathname === item.link;
          return (
            <Link key={idx} href={item.link}>
              <p
                className={`relative w-full font-poppins py-3 flex items-center gap-5 text-black transition-all duration-200 ${
                  isActive ? 'bg-accent text-white p-2' : 'hover:text-accent hover:scale-95'
                }`}
                onClick={() => handleSetActive(item.link)}
              >
                {IconComponent && <IconComponent size={24} />}
                {isExpanded && !isMobile && <span>{item.title}</span>}
              </p>
            </Link>
          );
        })}
      </nav>
      <span className={`py-3 mb-7 flex items-center gap-5 cursor-pointer font-poppins text-black hover:text-accent transition-all duration-200 hover:scale-95 ${isExpanded && !isMobile ? 'justify-start' : 'justify-center'}`}>
        <Logout />
        {isExpanded && !isMobile && <span>Signout</span>}
      </span>
    </menu>
  );
}
