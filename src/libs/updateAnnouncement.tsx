'use server'
import { revalidateTag } from 'next/cache'

export default async function updateAnnouncement(
    aid: string, 
    title: string, 
    description: string, 
    logoURL: string, 
    bannerURL: string, 
    token: string
) {
    const respond = await fetch(`${process.env.BACKEND_URL}/api/announcements/${aid}`, {
        method: "PUT",
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
        body: JSON.stringify({ 
            title: title, 
            description: description, 
            logoURL: logoURL, 
            bannerURL: bannerURL,
        })
    })

    if (!respond.ok) {
        const errText = await respond.text()
        throw new Error(`Failed to update announcement: ${respond.status} - ${errText}`)
    }

    revalidateTag('announcements')
    revalidateTag(`announcement-${aid}`)
    return await respond.json()
}