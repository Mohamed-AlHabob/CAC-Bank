"use client"

import Image from "next/image"


export default function Footer() {

  return (
    <div
      className=" relative h-[100vh] w-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #000000, #1a0933, #0c1a4d)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className=" mx-60 my-60 flex flex-col justify-between relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start w-full">
          <div className="flex flex-col items-start">
            <div className="relative w-full h-full mt-38">
              <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="./supernovalogo.svg"
                    width={250}
                    height={350}
                    alt="Supernova logo"
                  />
              </div>
            </div>
            <div className="text-white mt-52">
              <b className="text-5xl font-light">Built by </b><b className="text-6xl font-bold">Supernova </b><b className="text-5xl font-light">to infinity</b>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-xs text-gray-400 mt-8 md:mt-0">

          </div>
        </div>
      </div>
    </div>
  )
}

