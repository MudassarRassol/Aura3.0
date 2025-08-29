"uses client";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import TodayDate from "@/app/page/dashboard/date";
import { useEffect, useState } from "react";
import axios from "axios";
const Header = () => {
  
  const [name,setname] = useState("");
 
  const fetchname = async() => {
    try {
      const response = await axios.get("/api/getname");
      setname(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchname();
  },[])


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-3xl font-extrabold text-primary">
          Welcome back , {name} 😊
        </span>
        <TodayDate />
      </div>
      <Button size={"icon"} className="bg-none bg-transparent">
        <Bell size={20} className="text-black dark:text-white" />
      </Button>
    </div>
  );
};

export default Header;
