import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react'; // Assuming you're using Lucide icons
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
      <Card className="group relative overflow-hidden cursor-pointer max-w-xs mx-auto mt-[5%]">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="flex text-start gap-4 relative z-10">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white">
            <Plus size={24} />
          </div>

          <div>
            <CardTitle className="text-lg font-bold">
              {type === 'default' ? 'Add Project' : 'Submit Project'}
            </CardTitle>
            <CardDescription>
              {type === 'default'
                ? 'Click here to add a new project'
                : 'Click here to submit a new project'}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};
