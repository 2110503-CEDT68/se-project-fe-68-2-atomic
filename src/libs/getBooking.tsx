'use server'
export default async function getBooking(id: string, token: string) {

    const respond = await fetch(`${process.env.BACKEND_URL}/api/bookings/${id}`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
        next: { tags: ['bookings', `booking-${id}`], revalidate: 3600 }
    })
    if (!respond.ok) {
        const errText = await respond.text()
        throw new Error(`Failed to add booking: ${respond.status} - ${errText}`)
    }
    return await respond.json()
}