"use client"
import Button from "@/components/reusables/buttons/Button";
import InputComponent from "@/components/reusables/input/InputComponent";
import Typography from "@/components/reusables/typography/Typography";
import Image from "next/image";

export default function Login() {
  return (
    <section className="bg-[#EEEEEE] h-screen flex items-center justify-center">
      <div className="max-w-lg w-full ">
        <div className="flex justify-center mb-8">
          <Image src={'/genova.svg'} width={200} height={200} alt="genova logo" />
        </div>
        <div className="grid gap-3 bg-white p-10 rounded-lg shadow-md">
          <Typography variant="h1" size="lg" className={"text-center"}>Login to Dashboard</Typography>
          <InputComponent
            label="Email"
            type="email"
            placeholder="Enter your email"
            borderStyle="bottom"
          />
          <InputComponent
            label="Password"
            type="password"
            placeholder="Enter your password"
            password
            borderStyle="bottom"
          />
          <Typography variant="h2" size="sm" className={"text-start text-accent my-2"}>Forgot Password?</Typography>

          <Button title="Login" color="accent" type="submit" />
          <div className="flex justify-center -mt-2 mb-10 items-center">
          <Typography variant="body" size="sm" className={"text-center"}>Don&apos;t have an account?</Typography>
<span className="text-accent">Signup</span>
          
          </div>


        </div>
      </div>
    </section>
  );
}
