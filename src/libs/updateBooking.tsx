'use server'
import { revalidateTag } from 'next/cache'
export default async function updateBooking(bid:string, date:string, token: string){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/bookings/${bid}`, {
        method: "PUT",
		headers:{
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
        body: JSON.stringify({ date: date })
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to update booking: ${respond.status} - ${errText}`)
    }
    revalidateTag('bookings')
    revalidateTag(`booking-${bid}`)
    return await respond.json()
}