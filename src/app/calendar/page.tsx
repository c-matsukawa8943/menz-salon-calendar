'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/libs/firebase";
import CalendarTable from "./CalendarTable";
import Header from "./Header";

const CalendarPage = () => {
  const router = useRouter();

  // useEffect(() => {
  //   if (!auth.currentUser) {
  //     router.push("/login");
  //   }
  // }, []);

  return (
    <div>
      <Header />
      <CalendarTable />
    </div>
  );
};

export default CalendarPage; 