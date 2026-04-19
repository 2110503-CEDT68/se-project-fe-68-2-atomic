'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import deleteAnnouncement from "@/libs/deleteAnnoucement";


export default function AnnouncementDetail({ announcementJsonReady, isAdmin, token }: { announcementJsonReady: any, isAdmin: boolean, token?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!announcementJsonReady || !announcementJsonReady.data) {
    return <div className="p-10 font-bold text-3xl text-center">ไม่พบข้อมูลประกาศ</div>;
  }

  const announcementData: any = announcementJsonReady.data;

  const handleDelete = async () => {
    if (!token) return;
    if (confirm("Are you sure you want to delete this announcement?")) {
      setIsDeleting(true);
      try {
        await deleteAnnouncement(announcementData._id, token);
        router.push('/announcement');
        router.refresh();
      } catch (error) {
        setIsDeleting(false);
        alert("Failed to delete announcement.");
        console.error(error);
      }
    }
  };

  const monthMap: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };

  const dateObj = new Date(announcementData.createdAt);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = monthMap[String(dateObj.getMonth() + 1).padStart(2, '0')];
  const year = dateObj.getFullYear();
  let hour = dateObj.getHours();
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour == 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  const formattedDate = `${day} ${month} ${year} ${hour}:${minute} ${period}`;

  const formatText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\\n|\n/g, '<br />')
      .replace(/\\t|\t/g, '<span class="ml-8 inline-block"></span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const formattedTitle = formatText(announcementData.title);
  const formattedDescription = formatText(announcementData.description);

  return (
    <main className="max-w-6xl mx-auto w-full bg-white p-10 sm:p-16 rounded-[3rem] shadow-sm border border-slate-200 my-10 font-sukhumvit">

      {isDeleting ? (
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <CircularProgress size={60} thickness={4} />
          <p className="text-2xl font-bold text-slate-900">Deleting Announcement...</p>
        </div>
      ) : (
        <>
          {/* ✨ Back Button */}
          <div className="mb-8 flex justify-between items-center">
            {callbackUrl ? (
              <Link
                href={callbackUrl}
                className="inline-flex items-center text-gray-500 hover:text-black font-bold text-lg transition-colors group cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
            ) : (
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-500 hover:text-black font-bold text-lg transition-colors group cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}

            {isAdmin && (
              <div className="flex gap-4">
                <Link href={`/announcement/edit/${announcementData._id}`}>
                  <button className="bg-slate-900 text-white py-2 px-8 rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md cursor-pointer">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-8 rounded-full font-bold hover:bg-red-600 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="text-3xl my-2">
              <h1 className="inline font-bold" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
            </div>

            <div className="font-semibold opacity-50">
              <div className="flex flex-row items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                </svg>
                <h1 className="inline">Date: {formattedDate}</h1>
                {announcementData.isEdited && <span className="inline text-amber-600 font-bold ml-1"> (Edited)</span>}
              </div>

              <div className="flex flex-row items-center mt-1">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M850.662,877.56c-0.77,0.137-4.372,0.782-10.226,1.831c-230.868,41.379-273.337,48.484-278.103,49.037 c-11.37,1.319-19.864,0.651-25.976-2.042c-3.818-1.682-5.886-3.724-6.438-4.623c0.268-1.597,2.299-5.405,3.539-7.73 c1.207-2.263,2.574-4.826,3.772-7.558c7.945-18.13,2.386-36.521-14.51-47.999c-12.599-8.557-29.304-12.03-49.666-10.325 c-12.155,1.019-225.218,36.738-342.253,56.437l-57.445,45.175c133.968-22.612,389.193-65.433,402.622-66.735 c11.996-1.007,21.355,0.517,27.074,4.4c3.321,2.257,2.994,3.003,2.12,4.997c-0.656,1.497-1.599,3.264-2.596,5.135 c-3.835,7.189-9.087,17.034-7.348,29.229c1.907,13.374,11.753,24.901,27.014,31.626c8.58,3.78,18.427,5.654,29.846,5.654 c4.508,0,9.261-0.292,14.276-0.874c9.183-1.065,103.471-17.67,280.244-49.354c5.821-1.043,9.403-1.686,10.169-1.821 c9.516-1.688,15.861-10.772,14.172-20.289S860.183,875.87,850.662,877.56z" />
                  <path d="M231.14,707.501L82.479,863.005c-16.373,17.127-27.906,38.294-33.419,61.338l211.087-166.001 c66.081,29.303,118.866,38.637,159.32,38.637c71.073,0,104.065-28.826,104.065-28.826c-66.164-34.43-75.592-98.686-75.592-98.686 c50.675,21.424,156.235,46.678,156.235,46.678c140.186-93.563,213.45-296.138,213.45-296.138 c-14.515,3.99-28.395,5.652-41.475,5.652c-65.795,0-111-42.13-111-42.13l183.144-39.885C909.186,218.71,915.01,0,915.01,0 L358.176,495.258C295.116,551.344,250.776,625.424,231.14,707.501z" />
                </svg>
                <h1 className="inline">Author: {announcementData.author.name}</h1>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="relative w-full aspect-[3/4] md:aspect-video overflow-hidden my-8">
            <Image
              src={announcementData.bannerURL}
              alt={announcementData.title}
              fill
              priority
              className="object-contain p-4"
            />
          </div>

          {/* Description */}
          <div className="text-center space-y-2 text-gray-700 leading-relaxed">
            <p
              className="text-lg font-medium text-left"
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          </div>

          {/* Blank Section */}
          <div className="mb-50"></div>
        </>
      )}
    </main>
  );
}