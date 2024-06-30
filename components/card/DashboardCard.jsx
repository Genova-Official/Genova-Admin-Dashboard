"use client"
import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';

const DashboardCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 border rounded-md shadow-md flex flex-col items-start gap-2 w-[243px] h-[145px]">
      <div className="flex items-center gap-2">
        <div className="bg-purple-200 p-2 rounded-full">
          {/* <IconContext value={{ className: "text-purple-600 h-6 w-6" }}>
            {React?.createElement(icon)}
          </IconContext> */}
          {icon}
        </div>
        <span className="text-gray-700 font-medium text-base">{title}</span>
      </div>
      <span className="text-accent my-3 font-bold text-3xl">{value}</span>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default DashboardCard;
