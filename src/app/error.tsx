'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Rounded from "@/components/global/button/RoundedButton"
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Something went wrong!</h2>
        
        <div className="flex items-center justify-center mb-8">
          <span className="block w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
          <p className="text-xl md:text-2xl opacity-75">{error.message || 'Unknown error occurred'}</p>
        </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center m-[50px]">
                <Rounded
                 onClick={() => reset()}
                 >
                    <p> Try again</p>
                </Rounded>
                <Rounded>
                <Link
                 href="/#"
                 >
                    <p>Return home</p>
                </Link>
                </Rounded>
            </div>
      </div>
    </div>
  );
}