'use client';

import { CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import addAnnouncement from '@/libs/addAnnouncement';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddAnnouncementPanel({ token }: { token: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logoURL: '',
    bannerURL: '',
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
      setError('You must be logged in to perform this action.');
      return;
    }

    if (!window.confirm("Are you sure you want to add this announcement?")) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addAnnouncement(
        formData.title,
        formData.description,
        formData.logoURL,
        formData.bannerURL,
        token
      );

      setIsLoading(false);
      setSuccess(true);

      router.push(callbackUrl || '/announcement/manage');
      router.refresh();

    } catch (err: any) {
      setIsLoading(false);
      setError('Failed to add announcement. Please try again.');
    }
  };

  return (
    <div>
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl p-12 rounded-[2rem] shadow-xl min-h-[400px] flex flex-col justify-center">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-20">
              <CircularProgress />
              <p className="text-2xl font-bold text-black">Adding Announcement...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-20">
              <p className="text-3xl font-bold text-green-600 text-center">Created Announcement Successfully!</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-extrabold text-center mb-12 text-black">
                Add New Announcement
              </h1>

              {error && (
                <p className="text-center text-red-600 font-medium mb-4">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  slotProps={{
                    htmlInput: {
                      maxLength: 100
                    }
                  }}
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={10} // ให้ช่อง Description ใหญ่ขึ้นหน่อย
                  variant="outlined"
                />

                <TextField
                  label="Logo Image ID (NOT URL)"
                  name="logoURL"
                  value={formData.logoURL}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Banner Image ID (NOT URL)"
                  name="bannerURL"
                  value={formData.bannerURL}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />

                <div className="flex flex-row gap-4 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => router.push(callbackUrl || '/announcement/manage')}
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