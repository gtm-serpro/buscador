// src/components/sidebar/Sidebar/SubgroupItem.tsx

import { Badge } from '@/components/ui/badge';

interface SubgroupItemProps {
  name: string;
  count: number;
  onSelect: () => void;
}

export default function SubgroupItem({ name, count, onSelect }: SubgroupItemProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full pl-6 pr-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-between group"
    >
      <span className="truncate">{name}</span>
      <Badge variant="outline" className="text-xs ml-2 shrink-0">
        {count.toLocaleString('pt-BR')}
      </Badge>
    </button>
  );
}