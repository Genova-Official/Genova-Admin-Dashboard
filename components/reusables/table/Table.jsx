"use client"
import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ columns, data, onRowClick }) => {
  const colHeaders = columns?.map(({ title, key }) => (
    <th
      key={key}
      className=" text-white   uppercase"
    >
        <p className=' bg-accent py-4 px-6  text-sm text-center font-[400] w-full'>

      {title}
        </p>
    </th>
  ));

  const tableData = data && data?.map((data, i) => (
    <tr
    onClick={()=>onRowClick && onRowClick(data)}
      key={`column${i}`}
      className={`text-left text-sm font-Poppins text-accent cursor-pointer  ${data.status === "Success" || data.status === "Active"  ? "hover:bg-green/30" : (data.status === "Failed") ?  "hover:bg-red/30" :"hover:bg-[#F7CB73]/20"} `}
    >
      {columns.map(({ render }, id) => (
        <td key={`data${i}${id}`} className="py-4 px-6  border-gray-200">
          {render ? render(data, i) : data[id]}
          </td>
      ))}
    </tr>
  ));

  return (
    <div className="overflow-auto p-2 shadow-lg box-shadow-sm border rounded-lg ">
      <table className="min-w-full   w-full border-collapse">
        <thead>
          <tr className=" border-gray-700">{colHeaders}</tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  onRowClick: PropTypes.func

//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
