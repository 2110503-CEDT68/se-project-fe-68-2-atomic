'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import { Rating } from "@mui/material"
import addReview from "@/libs/addReview"
import deleteReview from "@/libs/deleteReview"
import updateReview from "@/libs/updateReview"
import Swal from 'sweetalert2';

export default function ReviewDentistPanel({
  reviews,
  isAdmin,
  currentUserId,
  token,
  did
}: {
  reviews: ReviewJson,
  isAdmin: boolean,
  currentUserId: string | undefined,
  token: string | undefined,
  did: string;
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

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState<number | null>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleDropdown = (id: string) => {
    if (openDropdownId === id) setOpenDropdownId(null);
    else setOpenDropdownId(id);
  };

  const handleEditClick = (review: ReviewItem) => {
    setEditingReviewId(review._id);
    setEditTitle(review.title);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setOpenDropdownId(null);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!token) return;
    if (!editTitle.trim() || !editComment.trim() || !editRating) {
      alert("Please provide a title, comment and rating.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateReview(reviewId, editRating, editTitle, editComment, token);

      setEditingReviewId(null);

      Swal.fire({
        title: 'Updated!',
        text: 'Your comment has been updated.',
        icon: 'success',
        position: 'center',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-[2rem]' }
      });

      router.refresh();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update comment.',
        icon: 'error',
        position: 'center',
        customClass: { popup: 'rounded-[2rem]' }
      });
      console.error("Update review error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this comment?",
      icon: 'warning',
      position: 'center',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Yes, delete it!',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId, token);
        setOpenDropdownId(null);

        await Swal.fire({
          title: 'Deleted!',
          text: 'Successfully Deleted.',
          icon: 'success',
          position: 'center',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' }
        });

        router.refresh();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete comment.',
          icon: 'error',
          position: 'center',
          customClass: { popup: 'rounded-[2rem]' }
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) { router.push("/login"); return; }
    if (!title.trim() || !comment.trim() || !rating) {
      alert("Please provide a title, comment and rating.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addReview(dentistId, rating, title, comment, token);
      setTitle(""); setComment(""); setRating(0);
      router.refresh();
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white mx-2 my-2 pb-8 lg:pb-16 antialiased">
      <div className="max-w-4xl p-4 mx-auto rounded-lg shadow-xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Add a Comment</h2>
        </div>

        <form className="mb-6" onSubmit={handleSubmit}>
          <div className="py-2 px-4 mb-4 bg-gray-100 rounded-lg rounded-t-lg border border-gray-200">
            <label htmlFor="title" className="sr-only">Title</label>
            <input
              type="text" id="title"
              className="px-0 w-full text-sm text-gray-900 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent mb-2 placeholder-gray-500"
              placeholder="Review title..." value={title} onChange={(e) => setTitle(e.target.value)} required
            />
            <hr className="border-gray-300 mb-2" />
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              id="comment" rows={4}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-transparent"
              placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} required
            ></textarea>
          </div>
          <div className="flex justify-between pr-1">
            <button type="submit" disabled={isSubmitting} className="bg-black inline-flex items-center py-2.5 px-4 text-md font-bold text-center text-white rounded-lg focus:ring-4 focus:ring-gray-200 hover:bg-gray-800 disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Posting...' : 'Post comment'}
            </button>
            <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />
          </div>
        </form>

        <div className="flex justify-between items-center mb-6 mt-10">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Community Feedback ({reviews.total})</h2>
        </div>

        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
          {reviews.data.length ? reviews.data.map((review: ReviewItem) => {
            const isOwner = currentUserId === review.user._id;
            const canEdit = isOwner;
            const canDelete = isOwner || isAdmin;
            const hasPermission = canEdit || canDelete;

            if (editingReviewId === review._id) {
              return (
                <article key={review._id} className="p-5 text-base bg-blue-50/50 rounded-xl border-2 border-blue-200 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-900 font-bold">Editing Comment...</p>
                    <Rating value={editRating} onChange={(e, val) => setEditRating(val)} />
                  </div>
                  <input
                    className="w-full text-sm text-gray-900 font-semibold border border-blue-200 bg-white rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title"
                  />
                  <textarea
                    rows={3}
                    className="w-full text-sm text-gray-900 border border-blue-200 bg-white rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editComment} onChange={(e) => setEditComment(e.target.value)} placeholder="Comment"
                  />
                  <div className="flex justify-end gap-3">
                    <button onClick={handleCancelEdit} disabled={isUpdating} className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={() => handleSaveEdit(review._id)} disabled={isUpdating} className="px-4 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 cursor-pointer transition-colors">
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </article>
              );
            }

            return (
              <article key={review._id} className="p-6 text-base bg-gray-50 rounded-xl border border-gray-200">
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">{review.user.name}</p>
                    <p className="text-sm text-gray-500">{dayjs(review.createdAt).fromNow()} {review.isEdited && <span className="italic ml-1 text-xs text-gray-400">(Edited)</span>}</p>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <Rating readOnly value={review.rating} size="small" />

                    {hasPermission && (
                      <button onClick={() => toggleDropdown(review._id)} className="inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                      </button>
                    )}

                    {openDropdownId === review._id && (
                      <div className="absolute right-0 top-full mt-1 z-10 w-32 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                        <ul className="text-sm text-gray-700">
                          {canEdit && (
                            <li>
                              <button onClick={() => handleEditClick(review)} className="w-full text-left py-2.5 px-4 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                                Edit
                              </button>
                            </li>
                          )}
                          {canDelete && (
                            <li>
                              <button onClick={() => handleDeleteReview(review._id)} className="w-full text-left py-2.5 px-4 hover:bg-red-50 text-red-600 font-medium transition-colors cursor-pointer">
                                Delete
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </footer>
                <h3 className="text-gray-900 font-bold mb-1">{review.title}</h3>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </article>
            )
          }) : (
            <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">No comments yet. Be the first to share your experience!</p>
          )}
        </div>

      </div>
    </section>
  )
}