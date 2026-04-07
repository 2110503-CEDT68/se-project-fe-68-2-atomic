'use server'

export default async function getUserProfile(token:string){

	const respond = await fetch(`${process.env.BACKEND_URL}/api/auth/me`,
       {
		method: "GET",
		headers:{
			authorization: `Bearer ${token}`,
		},
		next: { tags: ['profile'], revalidate: 3600 }
	   })
	   if(!respond.ok){
		 throw new Error("Cannot get user profile")
	   }
 return await respond.json()
} 