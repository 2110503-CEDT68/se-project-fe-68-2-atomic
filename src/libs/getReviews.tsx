export default async function getReviews(page?: number, limit?: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/reviews?page=${page}&limit=${limit}`, {
    next: { tags: ['reviews'] }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}