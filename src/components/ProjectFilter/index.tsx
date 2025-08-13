'use client';

import { Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ICategoryOption {
  id: string;
  name: string;
}

interface ProjectFilterProps {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  categories: ICategoryOption[];
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  selectedCategories,
  setSelectedCategories,
  categories,
}) => {
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories([]); // Clear all selected categories
    } else {
      setSelectedCategories((prev) => (prev.includes(categoryId) ? [] : [categoryId]));
    }
  };

  return (
    <div className="w-full flex flex-col items-end gap-4 show-scrollbar">
      <div className="w-fit">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <Select
          onValueChange={(value) => handleCategorySelect(value)}
          value={selectedCategories[0] || 'all'}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              All
            </SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
