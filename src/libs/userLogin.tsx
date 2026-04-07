'use server'

export default async function userLogin(userEmail:string, userPassword:string){
    const respond = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword })
    })

    const data = await respond.json();
    console.log("Backend Response Status:", respond.status);
    console.log("Backend Data:", data);

    if(!respond.ok){
        return null; 
    }
    
    return data;
}