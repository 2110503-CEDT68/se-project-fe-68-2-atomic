"use client";

import Rating from "@mui/material/Rating";

interface FeedbackProps {
  title: string;
  comment: string;
  author: string;
  date: string;
  rating: number;
}

function Feedbacks({ title, comment, author, date, rating }: FeedbackProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      
      <div className="flex mb-3">
        <Rating name="read-only" value={rating} readOnly />
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
        {comment}
      </p>

      <div className="mt-auto">
        <p className="text-xs text-gray-400 font-semibold">{author}</p>
        <p className="text-[10px] text-gray-400">Submitted {date}</p>
      </div>
    </div>
  );
}

export default function ReviewHomePanel() {
  const feedbacks = [
    {
      title: "หมอหล่อบอกต่อ",
      comment: "การบริการดีมากค่ะ หมอเป็นมิตรน่ารัก แถมหล่อด้วยค่ะ ทำเอาดิฉันอยากหกล้มตกบันไดเพื่อให้คุณหมอช่วยรักษาเลยค่ะ",
      author: "สมหญิง",
      date: "2026-03-20",
      rating: 5
    },
    {
      title: "พนักงานเอาใจใส่",
      comment: "คือผมแค่กระหายน้ำ พนักงานสังเกตเห็นไวมาก รีบหยิบน้ำดื่มมาให้ผมเลย",
      author: "สมชาย",
      date: "2026-03-20",
      rating: 5
    },
    {
      title: "ระบบจองดีมาก",
      comment: "ดิฉันลองเล่นแล้ว ระบบเริ่ดมาก เอาไปเลยค่ะ เต็ม",
      author: "อ่อม มชิ",
      date: "2026-03-20",
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-8 bg-[#e3f2fd]"> 
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-black mb-12 text-left">
          Our Customer Feedbacks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((fb, index) => (
            <Feedbacks
              key={index}
              title={fb.title}
              comment={fb.comment}
              author={fb.author}
              date={fb.date}
              rating={fb.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}