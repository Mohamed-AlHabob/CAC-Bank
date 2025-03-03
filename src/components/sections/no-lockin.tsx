import { Sun, Moon, Settings } from "lucide-react"
import Image from "next/image"

export default function Content() {
  return (
      <><div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
              <div
                  key={i}
                  className="absolute bg-white rounded-full opacity-30"
                  style={{
                      width: Math.random() * 3 + 1 + "px",
                      height: Math.random() * 3 + 1 + "px",
                      top: Math.random() * 100 + "%",
                      left: Math.random() * 100 + "%",
                  }} />
          ))}
      </div><div className="container mx-auto flex flex-col md:flex-row justify-between items-start relative z-10">
              {/* Left side with logo and text */}
              <div className="mt-42 md:mb-0">
                  <div className="flex flex-col items-start">
                      <div className="relative w-40 h-40 mb-2">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-70"></div>
                            <Image src={"/supernovalogo.png"} width={400} height={200} alt={""}/>
                      </div>
                      <div className="text-white">
                          <p className="text-sm font-light">Built by</p>
                          <p className="text-2xl font-bold tracking-wider">supernova</p>
                          <p className="text-sm font-light">to infinity</p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-xs text-gray-400">
                  {Array.from({ length: 12 }).map((_, i) => (
                      <p key={i} className="whitespace-nowrap">
                          All rights reserved
                      </p>
                  ))}
              </div>
          </div>

      <div className="absolute bottom-0 left-0 right-0 py-3 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded" />
          <span className="text-xs text-gray-400">All rights reserved</span>
        </div>

        <div className="flex gap-2">
          <button className="w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
            <Sun className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
            <Moon className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
            <Settings className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
      </>
  )
}

