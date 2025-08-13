import Image from 'next/image';
import { TEAM_MEMBERS } from '@/constants';
import { SectionHeader } from '@/components/SectionHeader';

export const TeamSection = () => {
  return (
    <div
      id="team"
      className="flex flex-col gap-6 justify-center items-center mt-16 mb-24 pt-[5%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <SectionHeader
        title="TEAM"
        subtitle="Meet Our Team"
        description="A team of developers, designers, and community experts bringing Naddify to you."
      />

      <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-10">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.name} className="flex flex-col items-center gap-3">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div
                className="w-full h-full rounded-lg bg-cover bg-center transition-all duration-300 ease-in-out relative hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(52,211,153,0.15)] group"
                style={{
                  backgroundImage: `url(${member.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg" />
              </div>
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
  );
};
