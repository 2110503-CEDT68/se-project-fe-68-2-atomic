'use server'
import { revalidateTag } from 'next/cache'
export default async function deleteAnnouncement(
	aid: string,  
    token: string
){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/announcements/${aid}`, {
        method: "DELETE",
		headers:{
			authorization: `Bearer ${token}`,
		},
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to delete Announcement: ${respond.status} - ${errText}`)
    }
    revalidateTag('announcements')
    revalidateTag(`announcement-${aid}`)
    return await respond.json()
}