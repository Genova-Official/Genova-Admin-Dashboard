"use client"
import Button from "@/components/reusables/buttons/Button";
import InputComponent from "@/components/reusables/input/InputComponent";
import Typography from "@/components/reusables/typography/Typography";
import Image from "next/image";
import React from "react";

export default function TopNav({ ...props }) {
  return (
    <div className="p-4 border w-full border flex justify-between items-center px-8 border-gray-300" {...props}>
      <Image
        src={"/genova.svg"}
        alt="Boles Admin"
        width={100}
        height={100}
        className=" object-cover"
      />
      <InputComponent placeholder="Search" />
      <div className="flex gap-2 items-center">
        <Typography size="sm">John Doe</Typography>
        <Image src={"/genova.svg"} alt="Boles Admin" width={60} height={50} className="rounded-[50%]" />

      </div>
      {/* <Button title="ello" size="large" color="green" /> */}
    </div>
  );
}
