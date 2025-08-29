"use client"
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Mail } from "lucide-react";
import Link from "next/link";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/redux/store/authSlice";
const page = () => {

  const [Email,setemail] = useState("");
  const [Password,setpassword] = useState("");
  const [Error, seterror] = useState("");
  const [Loading, setloading] = useState(false);
  const Dispatch = useDispatch();
  const Router = useRouter();


  const handelsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      seterror("");
      setloading(true);
      setloading(true);
        const response = await axios.post("/api/login", {
          Email,
          Password
        });

        if (response.status === 201) {
          setloading(false);
          Dispatch(login());
          Router.push("/");
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
    <div className="  h-screen md:min-h-screen flex items-center justify-center mt-10  ">
      <Card className=" w-full md:max-w-3xl md:min-w-3xl  bg-transparent backdrop-blur-2xl   ">
        <div className=" flex flex-col items-center justify-center ">
          <span className=" font-semibold text-4xl text-primary  ">
            Sign In
          </span>
          <p className=" text-sm text-muted-foreground mt-4 ">
            Welcome back ! Please sign in to continue your journey.
          </p>
        </div>
        <form className=" flex flex-col gap-4 px-10 " onSubmit={(e)=>handelsubmit(e)} >
          <div className=" flex flex-col gap-4  ">
            <Label htmlFor="email" className=" font-semibold  ">
              Email
            </Label>
            <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
              <Mail className=" w-5 h-5 m-2  " />
              <Input
              value={Email}
              onChange={(e)=>{setemail(e.target.value)}}
                id="email"
                placeholder="Enter your email "
                className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0  bg-none   shadow-none "
              />
            </div>
          </div>
          <div className=" flex flex-col gap-4  ">
            <Label htmlFor="email" className=" font-semibold  ">
              Password
            </Label>
            <div className=" flex items-center justify-center select-none border border-muted-foreground rounded-md ">
              <Key className=" w-5 h-5 m-2  " />
              <Input
                value={Password}
                onChange={(e)=>{setpassword(e.target.value)}}
                id="password"
                placeholder="Enter your password "
                type="password"
                className=" border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
              />
            </div>
          </div>
          <Button type="submit" className=" mt-4  text-black">
            {
              Loading ? "Loading..." : "Sign In"
            }
          </Button>
        </form>
        {
          Error && (
            <p className=" text-red-500 text-center mt-4 " >
              {Error}
            </p>
          )
        }
        <div className=" flex flex-col md:flex-row items-center gap-4 justify-center " >
          <p>
            Don't have an account?
          </p>
          <div className="flex items-center gap-2" >
                      <Link href="/page/register" className=" text-primary cursor-pointer " >
            Sign up
          </Link>
          <span className=" text-primary cursor-pointer " > 
            |
          </span>
          <Link href="/page/forgot" className=" text-primary cursor-pointer " >
            Forgot Password?
          </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default page;
