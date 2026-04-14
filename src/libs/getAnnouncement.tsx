'use server'

export default async function getAnnouncement(id: string): Promise<AnnouncementJsonSingle> {
	const respond = await fetch(`${process.env.BACKEND_URL}/api/announcements/${id}`, { 
        next: { tags: ['announcements', `announcement-${id}`], revalidate: 3600 } 
    })
	
    if (!respond.ok) {
		const errText = await respond.text()
		throw new Error(`Failed to get announcement: ${respond.status} - ${errText}`)
	}
    
	return await respond.json()
}