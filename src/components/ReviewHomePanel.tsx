"use client";

import React, { useState, useEffect, useCallback } from "react";
import Rating from "@mui/material/Rating";
import useEmblaCarousel from "embla-carousel-react";
import dayjs from "dayjs";

export default function ReviewHomePanel({ reviews }: { reviews: ReviewJson }) {

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  // --- เพิ่ม State สำหรับเก็บว่ารีวิวไหนถูกกด Read More ไว้บ้าง ---
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  // --- ฟังก์ชันสำหรับสลับสถานะ Read more / Show less ---
  const toggleReadMore = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-16 px-8 md:px-20 lg:px-40 bg-[#e3f2fd]">

      <div className="max-w-6xl mx-auto my-5">

        {/* Header Text */}
        <h2 className="text-4xl font-bold text-black mb-12 text-left">
          Our Customer Feedbacks
        </h2>

        {/* Embla Wrapper */}
        <div className="relative px-4">

          {/* Left Button */}
          <button
            className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-10 
                      w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center 
                      hover:bg-gray-50 transition-all text-blue-600 font-bold border border-gray-100"
            onClick={scrollPrev}
          >
            {"<"}
          </button>

          {/* Right Button */}
          <button
            className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-10 
                      w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center 
                      hover:bg-gray-50 transition-all text-blue-600 font-bold border border-gray-100"
            onClick={scrollNext}
          >
            {">"}
          </button>

          {/* View Port */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>

            {/* Container */}
            <div className="flex -ml-6 my-5">

              {/* Comment Card */}
              {reviews.data.map((review: ReviewItem) => {
                
                // เช็คว่าการ์ดใบนี้ถูกกดขยายอยู่หรือเปล่า
                const isExpanded = expandedComments[review._id];
                // เช็คความยาวตัวอักษรเพื่อกำหนดว่าจะโชว์ปุ่มไหม (สมมติว่า 150 ตัวอักษรคือประมาณ 4 บรรทัด)
                const isLongText = review.comment.length > 150;

                return (
                  <div key={review._id} className="flex-[0_0_100%] md:flex-[0_0_33.333333%] min-w-0 pl-6">
                    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full select-none transition-all">

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{review.title}</h3>

                      {/* Dentist Name */}
                      <p className="text-xs text-gray-400 font-semibold my-1">Dentist: {review.dentist.name}</p>

                      {/* Rating */}
                      <div className="flex my-3">
                        <Rating name="read-only" value={review.rating} readOnly />
                      </div>

                      {/* Comment */}
                      <div className="mb-6 flex-grow flex flex-col items-start">
                        <p 
                          className={`text-gray-600 text-sm leading-relaxed transition-all ${
                            isExpanded ? "" : "line-clamp-4"
                          }`}
                        >
                          {review.comment}
                        </p>
                        
                        {/* Read More Button */}
                        {isLongText && (
                          <button
                            onClick={() => toggleReadMore(review._id)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-bold mt-2 hover:underline focus:outline-none z-20 cursor-pointer"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>

                      {/* Author */}
                      <div className="mt-auto">

                        {/* Patient Name */}
                        <p className="text-xs text-gray-400 font-semibold">{review.user.name}</p>

                        {/* Date with Edited Tag */}
                        <div className="text-[10px] text-gray-400">
                          <p className="inline">{dayjs(review.createdAt.toString()).format("DD-MM-YYYY h:mm A")}</p>
                          {
                            review.isEdited ?
                              <p className="inline"> (Edited)</p>
                              : null
                          }
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* Dot */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 transition-all duration-300 rounded-full ${index === selectedIndex ? "w-8 bg-blue-600" : "w-2 bg-blue-200"
                }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}