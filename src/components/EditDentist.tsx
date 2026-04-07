'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, TextField } from '@mui/material';
import updateDentist from '@/libs/updateDentist';

export default function EditDentist({ dentistJsonReady, token }: { dentistJsonReady: any, token: string }) {
  const router = useRouter();
  const dentist = dentistJsonReady.data;

  // State — pre-filled with current dentist data
  const [name, setName] = useState(dentist.name);
  const [expertise, setExpertise] = useState(dentist.areaOfExpertise);
  const [experience, setExperience] = useState(dentist.yearsOfExperience);
  const [imageURL, setImageURL] = useState(dentist.imageURL || dentist.picture || '');

  // Loading & error states
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(experience) < 0) {
      setUpdateError('Years of experience cannot be negative.');
      return;
    }

    if (confirm("Are you sure you want to update this dentist's information?")) {
      setIsUpdating(true);
      setUpdateError(null);
      try {
        await updateDentist(dentist.id, name, Number(experience), expertise, imageURL, token);
        router.push(`/dentists/${dentist.id}`);
        router.refresh();
      } catch (err: any) {
        setIsUpdating(false);
        const is500 = err?.message?.includes('500');
        setUpdateError(is500
          ? 'There was a problem, please try again.'
          : 'Unable to update the dentist information.');
      }
    }
  };

  return (
    <div>
      {/* Main Card */}
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl min-h-[400px] flex flex-col justify-center">

          {isUpdating ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
              <CircularProgress />
              <p className="text-2xl font-bold text-black">Updating Dentist...</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-extrabold text-center mb-6 text-black">
                Edit Dentist
              </h1>
              <p className="text-center text-gray-500 font-semibold mb-4">Dentist ID: {dentist.id}</p>

              {updateError && (
                <p className="text-center text-red-600 font-medium mb-4">{updateError}</p>
              )}

              <form onSubmit={handleUpdate} className="space-y-10">
                {/* Form Inputs (Using Table layout to match EditBooking) */}
                <div className="flex flex-col gap-6 mt-12 max-w-md mx-auto">
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    slotProps={{
                      input: { className: "rounded-xl" }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Expertise"
                    variant="outlined"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    required
                    slotProps={{
                      input: { className: "rounded-xl" }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    variant="outlined"
                    type="number"
                    value={experience}
                    onChange={(e) => {
                      setExperience(e.target.value);
                      setUpdateError(null);
                    }}
                    required
                    error={!!updateError?.includes('negative')}
                    slotProps={{
                      input: { className: "rounded-xl" },
                      htmlInput: { min: 0 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Image URL (NOT ID)"
                    variant="outlined"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    required
                    slotProps={{
                      input: { className: "rounded-xl" }
                    }}
                  />
                </div>

                {/* Buttons Row */}
                <div className='flex flex-row justify-center gap-6 pt-6'>
                  {/* Cancel Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => router.back()} // เปลี่ยนเป็นย้อนกลับไปหน้าเดิม (เผื่อมาจากหน้า /dentists หรือ /dentists/[id])
                      className="cursor-pointer bg-black text-white text-xl font-bold py-3 px-10 rounded-full hover:bg-gray-800 transition active:scale-95 shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                  {/* Done Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="cursor-pointer bg-blue-600 text-white text-xl font-bold py-3 px-12 rounded-full hover:bg-blue-800 transition active:scale-95 shadow-lg disabled:bg-gray-400"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}