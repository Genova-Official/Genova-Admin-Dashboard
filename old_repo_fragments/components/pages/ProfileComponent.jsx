import React from "react";
import { useForm } from "react-hook-form";
import Typography from "../reusables/typography/Typography";
import InputComponent from "../reusables/input/InputComponent";

export default function ProfileComponent({ customer }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: customer?.first_name,
      email: customer?.email,
      phone: customer?.phone,
      address: customer?.address,
      accountName: customer?.bank_name,
      accountNumber: customer?.account_number,
      genovaId: customer?.genova_id,
      bvn: customer?.bvn,
      cardNumber: customer?.card_number,
      cardType: customer?.card_type,
      expiryDate: customer?.expiry_date,
    }
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border">
      <Typography size="lg" variant="h3" className="text-accent mb-4">
        Profile Information
      </Typography>
      <div className="personalData items-center grid md:grid-cols-3 grid-cols-1 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Personal Data
        </Typography>

        <div className="md:col-span-2 col-span-1 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Name"
            label="Name"
            defaultValue={customer?.first_name}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />
          <InputComponent
            placeholder="Email"
            label="Email"
            defaultValue={customer?.email}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
          />
          <InputComponent
            placeholder="Phone number"
            label="Phone Number"
            defaultValue={customer?.phone}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("phone", { required: "Phone number is required" })}
            error={errors.phone}
          />
          <InputComponent
            placeholder="Address"
            label="Address"
            defaultValue={customer?.address}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("address", { required: "Address is required" })}
            error={errors.address}
          />
        </div>
      </div>
      <hr className="my-3 bg-accent" />
      <div className="account items-center grid md:grid-cols-3 grid-cols-1 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Account Information
        </Typography>

        <div className="md:col-span-2 col-span-1 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Account name"
            label="Account Name"
            defaultValue={customer?.bank_name}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("accountName", { required: "Account name is required" })}
            error={errors.accountName}
          />
          <InputComponent
            placeholder="Account Number"
            label="Account Number"
            defaultValue={customer?.account_number}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("accountNumber", { required: "Account number is required" })}
            error={errors.accountNumber}
          />
          <InputComponent
            placeholder="Genova Id"
            label="Genova Id"
            defaultValue={customer?.genova_id}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("genovaId", { required: "Genova Id is required" })}
            error={errors.genovaId}
          />
          <InputComponent
            placeholder="BVN"
            label="BVN"
            defaultValue={customer?.bvn}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("bvn", { required: "BVN is required" })}
            error={errors.bvn}
          />
        </div>
      </div>
      <hr className="my-3 bg-accent" />
      <div className="account items-center grid grid-cols-1 md:grid-cols-3 px-8 py-9">
        <Typography size="md" variant="h2" className="text-accent py-4 mb-2">
          Card Information
        </Typography>

        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 gap-y-[50px]">
          <InputComponent
            placeholder="Card Number"
            label="Card Number"
            defaultValue={customer?.card_number}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("cardNumber", { required: "Card number is required" })}
            error={errors.cardNumber}
          />
          <InputComponent
            placeholder="Card Type"
            label="Card Type"
            defaultValue={customer?.card_type}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("cardType", { required: "Card type is required" })}
            error={errors.cardType}
          />
          <InputComponent
            placeholder="Expiry Date"
            label="Expiry Date"
            defaultValue={customer?.expiry_date}
            labelColor="rgba(102, 0, 102, 0.5)"
            {...register("expiryDate", { required: "Expiry date is required" })}
            error={errors.expiryDate}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
