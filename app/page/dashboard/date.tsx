"use client";
import React from "react";

const TodayDate = () => {
  const today = new Date();

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatted = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;

  return <span>{formatted}</span>;
};

export default TodayDate;
