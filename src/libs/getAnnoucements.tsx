'use server'
export default async function getAnnouncements(token:string){
   const respond = await fetch(`${process.env.BACKEND_URL}/api/announcements`,{
	method: "GET",
	 headers: {
		authorization: `Bearer ${token}`
	 },
	 next: {tags: ['announcements'], revalidate: 3600}
   })
   if(!respond.ok){
	throw new Error("Failed to get Announcements")
   }
   const data = await respond.json();

   return data.sort((a:any,b:any)=>
   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)
}