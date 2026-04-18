export default async function getAnnouncements(page: number, limit: number = 10) {
  
  const response = await fetch(`${process.env.BACKEND_URL}/api/announcements?page=${page}&limit=${limit}`, {
    next: { tags: ['announcements'] } // ถ้ามี
  });

  if (!response.ok) {
    throw new Error("Failed to fetch announcements");
  }

  return response.json();
}