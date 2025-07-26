import { Twitter } from 'lucide-react'
import { Badge } from '../ui/badge'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Mondalf',
    role: 'Founder',
    image: 'images/team/andalf.jpeg',
    twitter: 'andalfthegreat',
  },
  {
    name: 'Toad',
    role: 'Founder',
    image: 'images/team/toad.png',
    twitter: 'Toadster69',
  },
  {
    name: 'Tonashiro',
    role: 'Developer/Founder',
    image: 'images/team/tonashiro.png',
    twitter: 'tonashiro_',
  },
  {
    name: 'Benja',
    role: 'Founder',
    image: 'images/team/benja.jpeg',
    twitter: '1stBenjaNAD',
  },
  {
    name: 'Velkan',
    role: 'Developer',
    image: 'images/team/velkan.jpeg',
    twitter: 'velkan_gst',
  },
  {
    name: 'Novee',
    role: 'Backend Supporter',
    image: 'images/team/novee.png',
    twitter: 'Novee_VeenoX',
  },
  {
    name: 'Diegovas',
    role: 'Contributor',
    image: 'images/team/diego.jpeg',
    twitter: 'vasdie',
  },
  {
    name: 'g-van',
    role: 'Contributor',
    image: 'images/team/gvan.jpeg',
    twitter: '_gvan',
  },
  {
    name: 'Ray J',
    role: 'Contributor',
    image: 'images/team/rayj.jpeg',
    twitter: '0xRayJ',
  },
  {
    name: 'Rosin',
    role: 'Contributor',
    image: 'images/team/rosin.jpeg',
    twitter: 'rosinxyz',
  },
]

export const TeamSection = () => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center mt-10 mb-24">
      <Badge variant="default" className="font-bold">
        TEAM
      </Badge>
      <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
        Meet Our Team
      </h2>
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl text-center font-medium">
        A team of developers, designers, and community experts bringing Naddify
        to you.
      </p>

      <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-10">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex flex-col items-center gap-3">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div
                className="team-image"
                style={{
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[#D6BBFB] font-mono uppercase text-xs font-semibold tracking-[1px]">
                {member.name}
              </span>
              <span className="text-gray-400 text-sm">{member.role}</span>
            </div>

            <a
              href={`https://x.com/${member.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100/7 hover:bg-gray-100/10 transition-colors"
            >
              <Image src="/images/x.svg" alt="X" width={11} height={11} />
              <span className="text-sm text-gray-300">{member.twitter}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
