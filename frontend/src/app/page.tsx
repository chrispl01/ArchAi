// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-col flex justify-center w-full min-h-[80vh] text-left px-4 sm:px-4 md:px-8 lg:px-24 xl:px-32 animate-slide-in-right-to-left">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">ArchAi</h1>
      <p className="sm:text-md md:text-lg w-[70%] mb-1">
        ArchAi is an platform that uses llm for automated generation of modern
        cloud architectures
      </p>
      <p className="sm:text-md md:text-md mb-8">
        — fast, efficient, and scalable
      </p>
      <button className="bg-gray-900 border-1 border-gray-100 font-semibold px-8 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-30">
        <Link href="/generator" passHref>
          Try it!
        </Link>
      </button>
    </div>
  );
}
