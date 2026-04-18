'use server'
import { revalidateTag } from 'next/cache'

export async function revalidateAnnouncement(id: string) {
    // This clears the cache for both the list and the specific item
    revalidateTag('announcements')
    revalidateTag(`announcement-${id}`)
}