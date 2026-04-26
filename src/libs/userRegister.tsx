'use server'

export default async function userRegister(username:string, userTelephone:string,userEmail:string,userPassword:string, policyConsent:boolean, policyConsentVersion:string = '1.0'){
	const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`,{
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		 name: username,
		 telephone: userTelephone,
		 email: userEmail,
		 password: userPassword,
		 policyConsent,
		 policyConsentVersion
		})
	})
    if(!response.ok){
	    const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `Error ${response.status}`)
    }
    return await response.json();
}