'use server'

export default async function getDentists() {

	const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists?limit=9`, { next: { tags: ['dentists'], revalidate: 3600 } })
	if (!respond.ok) {
		throw new Error("Failed to fetch dentists")
	}
	return await respond.json()
}