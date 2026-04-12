'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

export default function AnnouncementDatail({announcementJsonReady, isAdmin}: {announcementJsonReady: AnnouncementJson, isAdmin: boolean}) {

  const announcementData: AnnouncementItem = announcementJsonReady.data;

  const dateObj = new Date(announcementData.createdAt);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  if (!announcementJsonReady.data) {
    return <div className="p-10 font-bold text-3xl text-center">ไม่พบข้อมูลประกาศ</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-8 w-full m-10">
      <div className="text-3xl my-2">
        <h1 className="inline font-bold">Topic : </h1><h1 className="inline font-normal">{announcementData.title}</h1>
      </div>

      <div className="font-semibold opacity-70">
        <div className="flex flex-row">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h1 className="inline">Date: {formattedDate}</h1>
          {
            announcementData.isEdited ? 
            <h1 className="inline"> (Edited)</h1>
            :
            null
          }
        </div>

        <h1>Author: {announcementData.author.name}</h1>
      </div>
    </main>
  );
}