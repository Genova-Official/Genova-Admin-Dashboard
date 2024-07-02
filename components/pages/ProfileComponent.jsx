import React from "react";
import Typography from "../reusables/typography/Typography";
import InputComponent from "../reusables/input/InputComponent";

export default function ProfileComponent() {
  return (
    <div className="border">
      <Typography size="lg" variant="h3" className="text-accent mb-4">
        Profile Information
      </Typography>
      <div className="personalData  items-center grid grid-cols-3 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Personal Data
        </Typography>

        <div className="  col-span-2 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Name"
            label="Name"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Email"
            label="Email"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Phone number"
            label="Phone Number"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Address"
            label="Address"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
        </div>
      </div>
      <hr className=" my-3 bg-accent" />
      <div className="account  items-center grid grid-cols-3 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Account Information
        </Typography>

        <div className="  col-span-2 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Account name"
            label="Account Name"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Account Number"
            label="Account Number"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Genova Id"
            label="Genova Id"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="BVN"
            label="BVN"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
        </div>
      </div>
      <hr className=" my-3 bg-accent" />
      <div className="account  items-center grid grid-cols-3 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Card Information
        </Typography>

        <div className="  col-span-2 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Card Number"
            label="Card Number"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Card Type"
            label="Card Type"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          <InputComponent
            placeholder="Expiry Date"
            label="Expiry Date"
            labelColor="rgba(102, 0, 102, 0.5)"
          />
          {/* <InputComponent placeholder="BVN" label="BVN" labelColor="rgba(102, 0, 102, 0.5)" /> */}
        </div>
      </div>
    </div>
  );
}
