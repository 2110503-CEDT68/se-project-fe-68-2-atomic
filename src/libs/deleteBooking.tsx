'use server'
import { revalidateTag } from 'next/cache'
export default async function deleteBooking(bid:string, token: string){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/bookings/${bid}`, {
        method: "DELETE",
		headers:{
			authorization: `Bearer ${token}`,
		},
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to delete booking: ${respond.status} - ${errText}`)
    }
    revalidateTag('bookings')
    revalidateTag(`booking-${bid}`)
    return await respond.json()
}