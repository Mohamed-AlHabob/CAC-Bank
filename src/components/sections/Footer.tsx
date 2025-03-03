import  Content  from './no-lockin'

export default function Footer() {
  return (
    <div 
        className='relative h-[800px] w-full bg-gradient-to-br from-black via-purple-950 to-blue-950 text-white py-12 px-6 overflow-hidden '
        style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
        <div className='relative h-[calc(100vh+800px)] -top-[100vh]'>
            <div className='h-[800px] sticky top-[calc(100vh-800px)]'>
              <Content />
            </div>
        </div>
    </div>
  )
}