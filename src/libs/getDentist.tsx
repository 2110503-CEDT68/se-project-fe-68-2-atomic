'use server'

export default async function getDentist(id: string) {
	const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists/${id}`, { next: { tags: ['dentists', `dentist-${id}`], revalidate: 3600 } })
	if (!respond.ok) {
		const errText = await respond.text()
		throw new Error(`Failed to get dentist: ${respond.status} - ${errText}`)
	}
	return await respond.json()
}