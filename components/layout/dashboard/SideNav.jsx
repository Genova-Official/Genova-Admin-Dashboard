"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {  FaCog, FaSignOutAlt } from 'react-icons/fa';
import { sideData } from './data';
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { BsListColumnsReverse } from "react-icons/bs";

const iconMap = {
  home: RxDashboard,
  user: GoPerson,
  transaction: BsListColumnsReverse,
  settings: FaCog,
  logout: FaSignOutAlt,
};

export default function SideNav({ ...props }) {
const pathname = usePathname()
    const [activeItem, setActiveItem] = useState('');
console.log(pathname)
  const handleSetActive = (itemLink) => {
    setActiveItem(itemLink);
  };

  return (
    <menu {...props}>
      <nav className="mx-auto flex flex-col gap-3">
        {sideData.map((item, idx) => {
          const IconComponent = iconMap[item.icon];
          const isActive = pathname === item.link;
          return (
            <Link key={idx} href={item.link}>
              <p
                className={`relative w-full font-poppins py-3 flex items-center gap-5 text-{#000} transition-all duration-200 ${
                  isActive ? 'bg-accent text-white p-2' : 'hover:text-accent hover:scale-95'
                }`}
                onClick={() => handleSetActive(item.link)}
              >
                {IconComponent && <IconComponent size={24} />}
                {item.title}
              </p>
            </Link>
          );
        })}
      </nav>

      <span className="mx-auto mt-auto py-3 mb-7 flex items-center gap-5 font-poppins text-base text-white transition-all duration-200 hover:scale-95">
        <FaSignOutAlt size={24} />
        Logout
      </span>
    </menu>
  );
}
