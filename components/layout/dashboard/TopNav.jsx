"use client"
import Button from "@/components/reusables/buttons/Button";
import Image from "next/image";
import React from "react";

export default function TopNav({ ...props }) {
  return (
    <div className="p-4 border w-full border border-gray-300" {...props}>
      <Image
        src={"/genova.svg"}
        alt="Boles Admin"
        width={100}
        height={100}
        className=" object-cover"
      />
      {/* <Button title="Hello" size="large" color="green" /> */}
    </div>
  );
}
