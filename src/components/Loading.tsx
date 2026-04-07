import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#c2f3f3] flex items-center justify-center">
      <div className="bg-white rounded-[2rem] shadow-xl px-16 py-14 flex flex-col items-center gap-6 min-w-[280px]">

        {/* MUI spinner */}
        <CircularProgress size={52} thickness={4} />

        {/* Loading text with animated dots */}
        <p className="text-2xl font-bold text-gray-700 tracking-wide">
          Loading
          <span className="inline-flex gap-[2px] ml-1">
            <span className="animate-[bounce_1s_infinite_0ms]">.</span>
            <span className="animate-[bounce_1s_infinite_150ms]">.</span>
            <span className="animate-[bounce_1s_infinite_300ms]">.</span>
          </span>
        </p>
      </div>
    </div>
  );
}