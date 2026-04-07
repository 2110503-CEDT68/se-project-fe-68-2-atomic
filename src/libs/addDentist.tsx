'use server'
import { revalidateTag } from 'next/cache'
export default async function addDentist(name:string, expertise:string, experience:string, imageURL:string, token: string){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists`, {
        method: "POST",
		headers:{
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
        body: JSON.stringify({ name: name, areaOfExpertise: expertise, yearsOfExperience: experience, imageURL: 'https://drive.google.com/uc?id=' + imageURL })
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to add dentist: ${respond.status} - ${errText}`)
    }
    revalidateTag('dentists')
    return await respond.json()
}