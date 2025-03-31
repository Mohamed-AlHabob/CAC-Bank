import Rounded from '@/components/global/button/RoundedButton';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="fixed inset-0 bg-[#141516] flex flex-col items-center justify-center text-white z-50 p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">404 | Page Not Found</h2>
        
        <div className="flex items-center justify-center mb-8">
          <span className="block w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
          <p className="text-xl md:text-2xl opacity-75">The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center m-[50px]">
                <Rounded
                 >
                   <Link href="/" >
                      Return home
                    </Link>
                </Rounded>
              
            </div>
      </div>
    </div>
  );
}