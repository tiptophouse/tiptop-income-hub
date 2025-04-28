
import React from 'react';
import { LucideProps } from 'lucide-react';

export const Search3D = (props: LucideProps) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 9a2 2 0 0 1 2 2" />
      <path d="M11 5a6 6 0 0 1 6 6" />
      <path d="M15 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H11" />
    </svg>
  );
};

export default Search3D;
