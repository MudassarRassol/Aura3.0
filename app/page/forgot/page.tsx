"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Link from "next/link";
const page = () => {
  const [email, setemail] = useState("");
  const [status,setstatus] = useState(400);
  const handelsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className=" h-screen md:min-h-screen flex items-center justify-center mt-10  ">
      <Card className=" w-full md:max-w-3xl md:min-w-3xl  bg-transparent backdrop-blur-2xl   ">
        <div className={` ${status == 200  && 'hidden'} flex flex-col items-center justify-center`}>
          <span className=" font-semibold text-4xl text-primary  ">
            Forgot Password
          </span>
          <p className=" text-sm text-muted-foreground mt-4 ">
            Enter your email to receive a password reset link.
          </p>
        </div>
        {status == 200 ? (
          <div className=" flex flex-col items-center justify-center " >
            <span className=" text-3xl font-bold text-primary " >Check Your Email!</span>
            <span>If an account exists, a reset link has been sent.</span>
          </div>
        ) : (
          <form
            className=" flex flex-col gap-4 px-10 "
            onSubmit={(e) => handelsubmit(e)}
          >
            <div className=" flex flex-col gap-4  ">
              <Label htmlFor="email" className=" font-semibold  ">
                Email
              </Label>
              <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
                <Mail className=" w-5 h-5 m-2  " />
                <Input
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  id="email"
                  placeholder="Enter your email "
                  className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
                />
              </div>
            </div>
            <Button type="submit" className=" mt-4  text-black">
              Send Reset Link
            </Button>
          </form>
        )}
        <div className=" flex items-center gap-4 justify-center ">
          <p>Remembered your password ?</p>
          <span className=" text-primary cursor-pointer ">|</span>
          <Link href="/page/login" className=" text-primary cursor-pointer ">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default page;
