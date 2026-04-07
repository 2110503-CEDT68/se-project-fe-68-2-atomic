'use server'

export default async function userRegister(username:string, userTelephone:string,userEmail:string,userPassword:string){
	const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`,{
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
	     name: username,
		 telephone: userTelephone,
		 email: userEmail,
		 password: userPassword
		})
	})
    if(!response.ok){
	    const errText = await response.text()
        throw new Error(`Failed to update dentist: ${response.status} - ${errText}`)
    }
    return await response.json();
}