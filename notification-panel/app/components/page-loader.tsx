"use client";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-xl animate-bounce">Loading...</p>
      </div>
    </div>
  );
}
