import { Plus } from 'lucide-react';
import Link from 'next/link';

interface IAddProjectCard {
  type?: 'submit' | 'default';
}

export const AddProjectCard: React.FC<IAddProjectCard> = ({ type = 'default' }) => {
  return (
    <Link
      href={type === 'default' ? '/projects/add' : 'https://t.co/XrpmVO5fDT'}
      target={type === 'default' ? '_self' : '_blank'}
    >
      <div className="w-fit flex items-center justify-center gap-2 py-3 px-6 rounded-lg relative z-10 bg-[#902EEC] text-white hover:bg-[#902EEC]/80 transition-colors">
        <Plus size={16} strokeWidth={2} className="hidden sm:block" />

        <div className="text-base sm:text-lg font-bold uppercase tracking-[1px]">
          {type === 'default' ? 'Add Project' : 'Submit Project'}
        </div>
      </div>
    </Link>
  );
};
