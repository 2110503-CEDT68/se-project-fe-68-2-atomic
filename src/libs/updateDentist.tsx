'use server'
import { revalidateTag } from 'next/cache'
export default async function updateDentist(did:string, name:string, experience:number, expertise:string, imageURL:string, token: string){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists/${did}`, {
        method: "PUT",
		headers:{
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
        body: JSON.stringify({ name: name, yearsOfExperience: experience, areaOfExpertise: expertise, imageURL: imageURL })
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to update dentist: ${respond.status} - ${errText}`)
    }
    revalidateTag('dentists')
    revalidateTag(`dentist-${did}`)
    return await respond.json()
}