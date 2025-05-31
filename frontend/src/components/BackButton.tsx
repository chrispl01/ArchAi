'use client';

import React from 'react';

export const BackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      aria-label="Zurück"
      className="duration-100 hover:scale-125 cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        className="w-10 h-10 text-white block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
