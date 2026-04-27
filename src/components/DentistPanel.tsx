'use client'
import Link from 'next/link';
import DentistCard from './DentistCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DentistPanel({dentistJsonReady, isAdmin=false, showSearch=false}: {dentistJsonReady: DentistJson, isAdmin?: boolean, showSearch?: boolean}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const filteredDentists = dentistJsonReady.data.filter((dentist: any)=>
    dentist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="pt-8 pb-16 px-8 bg-white mb-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-black mb-2">Our Dentists</h2>
          <p className="text-lg text-gray-700 font-medium">
            We offer you quality dentists to help you with your mouth problem
          </p>
        </div>

        {
          showSearch && (
          <input 
            type="text" 
            placeholder="🔍 Search dentist by name..." 
            className="mt-4 w-full md:w-1/2 p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          )

        }

        <div className="flex flex-wrap justify-center gap-8 mt-8">
              {
                filteredDentists.length === 0 ?
                <p>No dentists found</p> 
                :
                filteredDentists.map((dentist: DentistItem) => (
                  <Link key={dentist.id} href={`/dentists/${dentist.id}`}>
                    <DentistCard imgSrc={dentist.imageURL} dentistName={dentist.name} dentistExpertise={dentist.areaOfExpertise} dentistExperience={dentist.yearsOfExperience} rating={dentist.averageRating}/>
                  </Link>
                ))
              }
        </div>

        {
          isAdmin && showSearch ?
          <div className="flex flex-row justify-center gap-4">
            <button
              onClick={() => router.push(`/dentists/add`)}
              className="cursor-pointer bg-black text-white text-xl font-bold py-2 px-8 mt-2 rounded-full hover:bg-gray-800 transition flex items-center gap-2 active:scale-95"
              >
                Add Dentist
            </button>
          </div>
          : null
        }
      </div>
    </section>
  );
}