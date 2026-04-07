'use server'
import { revalidateTag } from 'next/cache'
export default async function addBooking(did: string, date: string, token: string) {

    const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists/${did}/bookings`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: date })
    })
    if (!respond.ok) {
        const errText = await respond.text()
        throw new Error(`Failed to add booking: ${respond.status} - ${errText}`)
    }
    revalidateTag('bookings')
    return await respond.json()
}