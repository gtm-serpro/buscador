// src/components/sidebar/Sidebar/GroupItem.tsx

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SubgroupItem from './SubgroupItem';

interface GroupItemProps {
  name: string;
  count: number;
  subgroups?: Array<{ name: string; count: number }>;
  onSelectGroup: () => void;
  onSelectSubgroup?: (subgroupName: string) => void;
}

export default function GroupItem({ 
  name, 
  count, 
  subgroups = [], 
  onSelectGroup,
  onSelectSubgroup 
}: GroupItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubgroups = subgroups.length > 0;

  const handleToggle = () => {
    if (hasSubgroups) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectGroup();
    }
  };

  return (
    <div className="mb-1">
      <button
        onClick={handleToggle}
        className="w-full px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-between group"
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasSubgroups && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )
          )}
          <span className="truncate">{name}</span>
        </div>
        <Badge variant="secondary" className="text-xs ml-2 shrink-0">
          {count.toLocaleString('pt-BR')}
        </Badge>
      </button>

      {isExpanded && hasSubgroups && (
        <div className="mt-1 space-y-0.5">
          {subgroups.map((subgroup) => (
            <SubgroupItem
              key={subgroup.name}
              name={subgroup.name}
              count={subgroup.count}
              onSelect={() => onSelectSubgroup?.(subgroup.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}