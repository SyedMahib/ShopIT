import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import defaultAvatar from "../../assets/default_avatar.jpg";
import { avatarSrc } from "../../utils/avatar";
import {
  useCanReviewQuery,
  useDeleteReviewMutation,
  useGetProductReviewsQuery,
  useSubmitReviewMutation,
} from "../../store/productsApi";
import type { Review } from "../../store/productsApi";
import type { RootState } from "../../store";

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ productId, existing }: { productId: string; existing?: Review }) {
  const [submitReview, { isLoading }] = useSubmitReviewMutation();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please choose a star rating");
      return;
    }
    setError("");
    try {
      await submitReview({ productId, rating, comment: comment.trim() }).unwrap();
      setSaved(true);
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Could not save your review.");
    }
  };

  const shown = hovered || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-50 p-5">
      <h3 className="font-semibold text-slate-900">{existing ? "Update your review" : "Write a review"}</h3>
      <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRating(value);
              setSaved(false);
            }}
            onMouseEnter={() => setHovered(value)}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            aria-pressed={rating === value}
            className="p-0.5"
          >
            <Star className={`h-7 w-7 ${value <= shown ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
          </button>
        ))}
      </div>
      <label htmlFor="review-comment" className="sr-only">Your review</label>
      <textarea
        id="review-comment"
        required
        maxLength={1000}
        rows={4}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setSaved(false);
        }}
        placeholder="What did you like or dislike?"
        className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-2 text-sm font-medium text-emerald-700">Thanks! Your review has been saved.</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-3 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : existing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

export default function ProductReviews({ productId, rating }: { productId: string; rating: number }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useGetProductReviewsQuery(productId);
  const { data: canReviewData } = useCanReviewQuery(productId, { skip: !isAuthenticated });
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews ?? [];
  const myReview = reviews.find((r) => r.user?._id === user?._id);
  const isAdmin = user?.role === "admin";

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview({ productId, reviewId }).unwrap();
    } catch {
      window.alert("Could not delete the review.");
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Customer reviews</h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={rating} />
            <span className="text-sm font-semibold text-slate-800">{rating.toFixed(1)} out of 5</span>
            <span className="text-sm text-slate-500">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {!isAuthenticated ? (
          <p className="text-sm text-slate-600">
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">Sign in</Link> to review
            this product after your order is delivered.
          </p>
        ) : canReviewData?.canReview ? (
          <ReviewForm key={myReview?._id ?? "new"} productId={productId} existing={myReview} />
        ) : (
          <p className="text-sm text-slate-500">You can review this product once an order containing it has been delivered.</p>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <li key={review._id} className="flex gap-4 py-5">
                <img
                  src={avatarSrc(review.user)}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {review.user?.name ?? "Former customer"}
                      {review.user?._id === user?._id && <span className="ml-1 font-normal text-slate-400">(you)</span>}
                    </p>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(review._id)}
                        aria-label="Delete review"
                        className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-1">
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
