'use server'
export default async function getBookings(token: string) {

	const respond = await fetch(`${process.env.BACKEND_URL}/api/bookings`, {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
		next: { tags: ['bookings'], revalidate: 3600 }
	})
	if (!respond.ok) {
		throw new Error("Failed to fetch bookings")
	}
	return await respond.json()
}