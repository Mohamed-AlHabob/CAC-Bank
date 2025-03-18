"use client"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const Structure = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    })

    clipAnimation.to(".mask-clip-path", {
      width: "90vw",
      height: "100vh",
      borderRadius: 0,
    })

    // Animation for the organizational structure tree
    const treeAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#org-structure",
        start: "top 100%",
        end: "bottom 100%",
        scrub: 0.3,
      },
    })

    treeAnimation
      .from(".tree-node", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.5,
      })
      .from(
        ".tree-connection",
        {
          scaleY: 0,
          transformOrigin: "top",
          stagger: 0.05,
          duration: 0.3,
        },
        "-=0.3",
      )
      // Add animation for horizontal connections
      .from(
        ".horizontal-connection",
        {
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.05,
          duration: 0.3,
        },
        "-=0.2",
      )
  })

  return (
    <>
      {/* Project Intro Section */}
      <section className="p-4 max-w-4xl mx-auto my-20 grid gap-2">
        <span className="text-sm">Date</span>
        <span className="text-lg font-medium ">July, 2023</span>
        <h2 className="text-6xl md:text-8xl font-light leading-none my-10">
          <span className="block">Organizational</span>
          <span className="block">Structure</span>
        </h2>
        <span className="text-sm ">Mission</span>
        <div className="grid md:grid-cols-2 gap-4">
          <p className="text-gray-500 leading-relaxed">
            The AI-Art Project is a transformative initiative dedicated to exploring the immense impact of AI-generated
            art on the art world and artists. We aim to discover and promote exceptional AI-generated artworks that push
            the boundaries of creativity, redefine traditional practices, and provoke thought.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Through collaborations with artists, workshops, and educational programs, we empower artists to leverage AI
            as a tool for exploration, expanding their artistic horizons and embracing new forms of expression.
          </p>
        </div>
      </section>

      {/* Second Set of Images Section */}
      <div className="w-full" id="clip">
        <div className="mask-clip-path relative left-1/2 top-0 z-20 h-[60vh] w-full origin-center -translate-x-1/2 overflow-hidden rounded-3xl md:w-[30vw]">
          <div className="flex items-center justify-center gap-8">
            {/* Gallery Items */}
            <div
              className="w-32 h-48 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/3.jpg?raw=true)",
              }}
            ></div>
            <div
              className="w-32 h-64 bg-cover object-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/2.jpg?raw=true)",
              }}
            ></div>
            <div
              className="w-32 h-80 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/1.jpg?raw=true)",
              }}
            ></div>
            <div
              className="w-full h-96 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: "url(https://3bp7blr8r1.ufs.sh/f/dNJm0guSuQfgB1AuUkSJ3PGs4lpjF8e5SIvENynmoKBkU0fD)",
              }}
            ></div>
            <div
              className="w-32 h-80 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/6.jpg?raw=true)",
              }}
            ></div>
            <div
              className="w-32 h-64 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/7.jpg?raw=true)",
              }}
            ></div>
            <div
              className="w-32 h-48 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://github.com/codrops/ScrollBasedLayoutAnimations/blob/main/img/8.jpg?raw=true)",
              }}
            ></div>
          </div>
        </div>
      </div>

      <section id="org-structure" className="p-4 max-w-4xl mx-auto my-20 grid gap-8">
        <div className="sticky top-48 flex flex-col items-center mb-[50vh] ">
          {/* Root Node */}
          <div className="tree-node relative z-10 w-64 p-4 bg-card border rounded-lg shadow-md text-center mb-12">
            <h4 className="font-medium text-lg">Chairman of the Board of Directors</h4>
            <p className="text-sm ">Dr. Ibrahim Al-Houthi</p>
          </div>

          {/* First Level Connections */}
          <div className="tree-connection absolute w-0.5 h-12 bg-primary top-[76px] left-1/2 -translate-x-1/2"></div>

          {/* Horizontal Connection for First Level */}
          <div className="horizontal-connection absolute w-[50%] h-0.5 bg-primary top-[88px] left-1/4"></div>

          {/* First Level Nodes */}
          <div className="grid grid-cols-2 gap-24 mb-12 w-full">
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-56 p-4 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium text-lg">Deputy Director</h4>
                <p className="text-sm text-gray-500">............</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-56 p-4 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium text-lg">Director</h4>
                <p className="text-sm text-gray-500">...............</p>
              </div>
            </div>
          </div>

          {/* Second Level Connections */}
          <div className="tree-connection absolute w-0.5 h-12 bg-primary top-[164px] left-[calc(25%-28px)]"></div>
          <div className="tree-connection absolute w-0.5 h-12 bg-primary top-[164px] left-[calc(75%-28px)]"></div>

          {/* Horizontal Connections for Second Level */}
          <div className="horizontal-connection absolute w-[12.5%] h-0.5 bg-primary top-[176px] left-[calc(12.5%)]"></div>
          <div className="horizontal-connection absolute w-[12.5%] h-0.5 bg-primary top-[176px] left-[calc(37.5%)]"></div>
          <div className="horizontal-connection absolute w-[12.5%] h-0.5 bg-primary top-[176px] left-[calc(62.5%)]"></div>
          <div className="horizontal-connection absolute w-[12.5%] h-0.5 bg-primary top-[176px] left-[calc(87.5%-12.5%)]"></div>

          {/* Second Level Nodes */}
          <div className="grid grid-cols-4 gap-6 w-full">
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-40 p-3 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium">Director</h4>
                <p className="text-xs text-gray-500">........</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-40 p-3 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium">Director</h4>
                <p className="text-xs text-gray-500">.........</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-40 p-3 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium">Director</h4>
                <p className="text-xs text-gray-500">..........</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="tree-node relative z-10 w-40 p-3 bg-card border rounded-lg shadow-md text-center">
                <h4 className="font-medium">Director</h4>
                <p className="text-xs text-gray-500">...........</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-[50vh]">
          <p className="text-gray-500 italic">
            Our binary tree structure enables efficient communication and decision-making processes, allowing for
            specialized teams to focus on their areas of expertise while maintaining cohesive organizational goals.
          </p>
        </div>
      </section>
    </>
  )
}

export default Structure

