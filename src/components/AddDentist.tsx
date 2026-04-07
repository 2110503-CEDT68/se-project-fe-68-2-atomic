'use client';

import { CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import addDentist from '@/libs/addDentist';
import { useRouter } from 'next/navigation';

export default function AddDentistPanel({ token }: { token: any }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    experience: '',
    imageURL: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in as an admin to perform this action.');
      return;
    }

    if (Number(formData.experience) < 0) {
      setError('Years of experience cannot be negative.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDentist(
        formData.name,
        formData.expertise,
        formData.experience,
        formData.imageURL,
        token
      );

      setIsLoading(false);
      setSuccess(true);

      router.push('/dentists');
      router.refresh();

    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to add dentist. Please try again.');
    }
  };

  return (
    <div>
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl min-h-[400px] flex flex-col justify-center">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-20">
              <CircularProgress />
              <p className="text-2xl font-bold text-black">Adding Dentist...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-20">
              <p className="text-3xl font-bold text-green-600 text-center">Created Dentist Successfully!</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-extrabold text-center mb-12 text-black">
                Add New Dentist
              </h1>

              {error && (
                <p className="text-center text-red-600 font-medium mb-4">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                <TextField
                  label="Dentist Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Years of Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="number"
                  slotProps={{ htmlInput: { min: 0 } }}
                />

                <TextField
                  label="Image ID (NOT URL)"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />

                <div className="flex flex-row gap-4 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/dentists')}
                    className="cursor-pointer bg-black text-white text-xl font-bold py-3 px-10 rounded-full hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer bg-blue-500 text-white text-xl font-bold py-3 px-10 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
                  >
                    Confirm
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}