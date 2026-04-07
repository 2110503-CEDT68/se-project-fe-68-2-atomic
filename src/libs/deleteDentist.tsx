'use server'
import { revalidateTag } from 'next/cache'
export default async function deleteDentist(did:string, token: string){
   
    const respond = await fetch(`${process.env.BACKEND_URL}/api/dentists/${did}`, {
        method: "DELETE",
		headers:{
			authorization: `Bearer ${token}`,
		},
    })
    if(!respond.ok){
        const errText = await respond.text()
        throw new Error(`Failed to delete dentist: ${respond.status} - ${errText}`)
    }
    revalidateTag('dentists')
    revalidateTag(`dentist-${did}`)
    return await respond.json()
}