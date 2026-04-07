'use client'

import { signOut } from "next-auth/react"

export default function LogoutPanel() {
    return (
        <div className="bg-white w-full max-w-lg p-10 rounded-[2rem] shadow-2xl text-center">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-black">
                You're going to Log Out
            </h1>
            <p className="text-black mb-8">Are you sure you want to log out?</p>
            <div className="pt-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer bg-black text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition active:scale-95"
                >
                    Log Out
                </button>
            </div>
        </div>
    )
}