'use server'
export default async function getAnnouncements(){
   const respond = await fetch(`${process.env.BACKEND_URL}/api/announcements`)
   if(!respond.ok){
	throw new Error("Failed to get Announcements")
   }
   const data = await respond.json();

   return data.sort((a:any,b:any)=>
   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)
}