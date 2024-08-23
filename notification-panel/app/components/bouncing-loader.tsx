"use client";

export default function BouncingLoader() {
  return (
    <div className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center">
      <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
    </div>
  );
}
