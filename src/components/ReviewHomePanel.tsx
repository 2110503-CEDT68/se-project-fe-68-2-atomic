"use client";

import Rating from "@mui/material/Rating";
import useEmblaCarousel from "embla-carousel-react";

export default function ReviewHomePanel({ reviews } : { reviews: ReviewJson }) {

  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    align: "start", 
    dragFree: false,
    skipSnaps: true
  });

  const formatDateString = (date: string | Date) => {
    if (!date) return '-';
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hour}:${minute} ${period}`;
  };
  
  return (
    <section className="py-16 px-8 bg-[#e3f2fd]"> 
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-black mb-12 text-left">
          Our Customer Feedbacks
        </h2>

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-6 my-5">
            {reviews.data.map((review: ReviewItem) => (
              <div key={review._id} className="flex-[0_0_100%] md:flex-[0_0_33.333333%] min-w-0 pl-6">
                <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-full select-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{review.title}</h3>
                  
                  <div className="flex mb-3">
                    <Rating name="read-only" value={review.rating} readOnly />
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {review.comment}
                  </p>

                  <div className="mt-auto">
                    <p className="text-xs text-gray-400 font-semibold">Dentist: {review.dentist.name}</p>
                    <p className="text-xs text-gray-400 font-semibold">{review.user.name}</p>
                    <div className="text-[10px] text-gray-400">
                      <p className="inline">{formatDateString(review.createdAt.toString())}</p>
                      {
                        review.isEdited ? 
                        <p className="inline"> (Edited)</p>
                        : null
                      }
                    </div>
                  </div>
                </div>  
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}