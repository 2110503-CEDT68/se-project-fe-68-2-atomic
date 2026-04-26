'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import { Rating } from "@mui/material"
import addReview from "@/libs/addReview"

export default function ReviewDentistPanel({
  reviews,
  isAdmin,
  currentUserId,
  token
}: {
  reviews: ReviewJson,
  isAdmin: boolean,
  currentUserId: string | undefined,
  token: string | undefined
}) {

  const params = useParams();
  const router = useRouter();

  const dentistId = params.did as string;

  dayjs.extend(relativeTime)

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDropdown = (id: string) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!token) {
      router.push("/login");

      return;
    }

    if (!title.trim() || !comment.trim() || !rating) {
      alert("Please provide a title, comment and rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview(dentistId, rating, title, comment, token)

      console.log("Submitting data:", { title, comment, rating });

      setTitle("");
      setComment("");
      setRating(0);

      router.refresh();
      
    } catch (error) {
      alert('Error submitting review');
      
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-8 lg:py-16 antialiased">
      <div className="max-w-4xl p-4 mx-auto rounded-lg shadow-xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Add a Comment</h2>
        </div>

        <form className="mb-6" onSubmit={handleSubmit}>
          <div className="py-2 px-4 mb-4 bg-gray-100 rounded-lg rounded-t-lg border border-gray-200">

            <label htmlFor="title" className="sr-only">Title</label>
            <input 
              type="text"
              id="title"
              className="px-0 w-full text-sm text-gray-900 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent mb-2 placeholder-gray-500"
              placeholder="Review title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <hr className="border-gray-300 mb-2" />

            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea 
              id="comment" 
              rows={4}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-between pr-1">
            <button type="submit"

              disabled={isSubmitting}
              className="bg-black inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post comment'}
            </button>
            <Rating 
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </div>
        </form>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Community Feedback ({reviews.total})</h2>
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-2">
          {
            reviews.data.length ?
              reviews.data.map((review: ReviewItem) => {

                const isOwner = currentUserId === review.user._id;
                const canEdit = isOwner;
                const canDelete = isOwner || isAdmin;
                const hasPermission = canEdit || canDelete;

                return (
                  <article key={review._id} className="p-6 text-base bg-gray-100 rounded-lg border border-gray-200 my-3">
                    <footer className="flex justify-between items-center mb-2">

                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">{review.user.name}</p>
                        <p className="text-sm text-gray-600">{dayjs(review.createdAt).fromNow()}</p>
                      </div>

                      <div className="relative flex items-center gap-4">
                        <Rating readOnly value={review.rating} />
                      
                          <button
                            onClick={() => toggleDropdown(review._id)}
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
                            type="button">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                            </svg>
                            <span className="sr-only">Comment settings</span>
                          </button>

                          {openDropdownId === review._id && (
                            <div className="absolute right-0 top-full mt-1 z-10 w-max max-w-xs bg-white rounded divide-y divide-gray-100 shadow border border-gray-200">
                              <ul className="py-1 text-sm text-gray-700">

                                {canEdit && (
                                  <li>
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100">Edit</a>
                                  </li>
                                )}

                                {canDelete && (
                                  <li>
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100 text-red-600">Delete</a>
                                  </li>
                                )}

                                {!hasPermission && (
                                  <li>
                                    <span className="block py-2 px-4 text-gray-400 italic">
                                      You do not have permission to edit this comment
                                    </span>
                                  </li>
                                )}

                              </ul>
                            </div>
                          )}

                      </div>

                    </footer>
                    
                    <h3 className="text-gray-900 font-semibold mb-1">{review.title}</h3>
                    <p className="text-gray-500">{review.comment}</p>
                  </article>
                )
              }) : (
                <p className="text-center text-gray-500 py-4">No comments yet.</p>
              )
          }
        </div>

      </div>
    </section>
  )
}