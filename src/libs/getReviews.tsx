export default async function getReviews({ page, limit, dentistId }: { page?: number, limit?: number, dentistId?: string }) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/reviews?page=${page}&limit=${limit}&dentist=${dentistId}`, {
    next: { tags: ['reviews'] }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}