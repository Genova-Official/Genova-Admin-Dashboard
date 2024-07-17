"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/reusables/buttons/Button";
import InputComponent from "@/components/reusables/input/InputComponent";
import Typography from "@/components/reusables/typography/Typography";
import Image from "next/image";
import { useEffect, useState } from "react";
import useCrud from "@/utils/useCrud";
import { toast } from "react-toastify";
import useCookies from "@/hooks/useCookies";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { setCookie } = useCookies();
  const router = useRouter();
  const { postData, response, error, loading } = useCrud("/adminapp/login/");

  const onSubmit = async (data) => {
    console.group(data);
    await postData(data);
  };

  useEffect(() => {
    if (response?.data) {
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        progress: false,
      });
      setCookie("gen_token", response?.data?.data?.access_token, { days: 7 });
      router.push("/dashboard");
    }
    else{
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        progress: false,
      });
    }
  }, [response?.data, setCookie,error, router]);
  return (
    <section className="bg-[#EEEEEE] h-screen flex items-center justify-center">
      <div className="max-w-lg w-full ">
        <div className="flex justify-center mb-8">
          <Image
            src={"/genova.svg"}
            width={200}
            height={200}
            alt="genova logo"
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 bg-white p-10 rounded-lg shadow-md"
          method="post"
        >
          <Typography variant="h1" size="lg" className="text-center">
            Login to Dashboard
          </Typography>
          <InputComponent
            label="Email"
            type="email"
            placeholder="Enter your email"
            borderStyle="bottom"
            name="email"
            register={register}
            error={errors.email?.message}
          />
          <InputComponent
            label="Password"
            type="password"
            placeholder="Enter your password"
            password
            borderStyle="bottom"
            name="password"
            register={register}
            // {...register("password")}
            error={errors.password?.message}
          />
          <Typography
            variant="h2"
            size="sm"
            className="text-start text-accent my-2"
          >
            Forgot Password?
          </Typography>

          <Button
            title="Login"
            color="accent"
            type="submit"
            isLoading={loading}
          />
          <div className="flex justify-center -mt-2 mb-10 items-center">
            <Typography variant="body" size="sm" className="text-center">
              Don&apos;t have an account?
            </Typography>
            <span className="text-accent">Signup</span>
          </div>
        </form>
      </div>
    </section>
  );
}
