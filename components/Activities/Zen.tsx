import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const items = [
  { type: "rock", icon: "🪨" },
  { type: "flower", icon: "🌸" },
  { type: "tree", icon: "🎄" },
  { type: "bamboo", icon: "🎋" },
];

const Zen = () => {

  const [placedItems, setPlacedItems] = useState<Array<{ type: string; icon: string ; x: number; y: number }>>([]);
  const [selectedItem, setSelectedItem] = useState(items[0]);


  const handelCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedItems([...placedItems, { ...selectedItem, x, y }]);


  }

  return(
      <div className="space-y-4" >
        <div className="flex items-center justify-center gap-4  " >
          {
            items.map((items)=>{
              return(
                <motion.button 
                key={items.type}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={()=>setSelectedItem(items)}
                className={`p-3 rounded-lg ${selectedItem.type === items.type ? "bg-primary/20 " : " text-primary bg-primary/5"} `}
                >
                  <span className="text-2xl" >
                    {items.icon}
                  </span>
                </motion.button>
              )
            })
          }
        </div>
        <div className=" relative w-full  h-[400px] bg-primary/20 rounded-lg cursor-pointer overflow-hidden selection:none " onClick={handelCanvasClick} >
        {
          placedItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: "absolute", left: item.x-12 , top: item.y-12 }}
              className="text-2xl select-none "
            >
              {item.icon}
            </motion.div>
          ))
        }
        </div>
      </div>
  )
  ;
};

export default Zen;
