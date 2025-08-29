"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Mail } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const page = () => {
  const [Email, setemail] = useState("");
  const [Password, setpassword] = useState("");
  const [Confirmpassword, setconfirmpassword] = useState("");
  const [Name, setname] = useState("");
  const [Error, seterror] = useState("");
  const Router = useRouter();
  const [Loading, setloading] = useState(false);
  const handelsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      seterror("");
      setloading(true);
      if (Password === Confirmpassword) {
        const response = await axios.post("/api/register", {
          Email,
          Password,
          username: name,
        });

        if (response.status === 201) {
          setloading(false);
          Router.push("/page/login");
        }
      } else {
        seterror("Passwords do not match");
      }
    } catch (err) {
      setloading(false);
      if (axios.isAxiosError(err)) {
        seterror(err.response?.data?.message || "Something went wrong");
      } else {
        seterror("Unexpected error");
      }
    }
  };

  return (
    <div className=" h-screen md:min-h-screen flex items-center justify-center  mt-10 ">
      <Card className=" w-full md:max-w-3xl md:min-w-3xl  bg-transparent backdrop-blur-2xl   ">
        <div className=" flex flex-col items-center justify-center ">
          <span className=" font-semibold text-4xl text-primary  ">
            Sign Up
          </span>
          <p className=" text-sm text-muted-foreground mt-4 ">
            Create your account to start your journey with Aura.
          </p>
        </div>
        <form
          className=" flex flex-col gap-4 px-10 "
          onSubmit={(e) => handelsubmit(e)}
        >
          <div className=" flex  gap-4 w-full ">
            <div className=" flex flex-col gap-2 w-full  ">
              <Label htmlFor="email" className=" font-semibold  ">
                Name
              </Label>
              <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
                <Mail className=" w-5 h-5 m-2  " />
                <Input
                  value={Name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                  id="Name"
                  placeholder="Enter your Name "
                  className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
                />
              </div>
            </div>
            <div className=" flex flex-col gap-2  w-full ">
              <Label htmlFor="email" className=" font-semibold  ">
                Email
              </Label>
              <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
                <Mail className=" w-5 h-5 m-2  " />
                <Input
                  value={Email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  id="email"
                  placeholder="Enter your email "
                  className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-col gap-2  ">
            <Label htmlFor="email" className=" font-semibold  ">
              Password
            </Label>
            <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
              <Key className=" w-5 h-5 m-2  " />
              <Input
                value={Password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                id="password"
                placeholder="Enter your password "
                type="password"
                className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
              />
            </div>
          </div>
          <div className=" flex flex-col gap-2  ">
            <Label htmlFor="email" className=" font-semibold  ">
              Confirm Password
            </Label>
            <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
              <Key className=" w-5 h-5 m-2  " />
              <Input
                value={Confirmpassword}
                onChange={(e) => {
                  setconfirmpassword(e.target.value);
                }}
                id="password"
                placeholder="Enter your Confirm Password "
                type="password"
                className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
              />
            </div>
          </div>
          <Button type="submit" className=" mt-4  text-black">
            {
              Loading
                ? "Creating..."
                : "Sign Up"
            }
          </Button>
        </form>
        {Error && <p className=" text-red-500 text-center mt-4 ">{Error}</p>}
        <div className=" flex items-center gap-4 justify-center ">
          <p>Already have an account</p>
          <span>|</span>
          <Link href="/page/login" className=" text-primary cursor-pointer ">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default page;
