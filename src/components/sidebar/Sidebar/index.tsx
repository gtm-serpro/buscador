// src/components/sidebar/Sidebar/index.tsx

import { useSearchStore } from '@/stores/searchStore';
import { useFilters } from '@/hooks/useFilters';
import { FILTERS_MAP } from '@/constants/filters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderOpen } from 'lucide-react';
import GroupItem from './GroupItem';

export default function Sidebar() {
  const { groupCounts } = useSearchStore();
  const { addFilter } = useFilters();

  const handleSelectGrupoProcesso = (groupName: string) => {
    const filter = FILTERS_MAP['grupo_processo'];
    addFilter({
      id: filter.id,
      label: filter.label,
      field: filter.field,
      value: groupName
    });
  };

  const handleSelectTipoProcesso = (typeName: string) => {
    const filter = FILTERS_MAP['tipo_processo'];
    addFilter({
      id: filter.id,
      label: filter.label,
      field: filter.field,
      value: typeName
    });
  };

  return (
    <div className="w-72 border-r bg-gray-50 flex flex-col h-[calc(100vh-65px)] overflow-auto">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Grupos e Tipos
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Grupo Processo */}
        {groupCounts.grupoProcesso.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Grupo Processo
            </h4>
            <div className="space-y-1">
              {groupCounts.grupoProcesso.map((group) => (
                <GroupItem
                  key={group.name}
                  name={group.name}
                  count={group.count}
                  onSelectGroup={() => handleSelectGrupoProcesso(group.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tipo Processo */}
        {groupCounts.tipoProcesso.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Tipo Processo
            </h4>
            <div className="space-y-1">
              {groupCounts.tipoProcesso.map((type) => (
                <GroupItem
                  key={type.name}
                  name={type.name}
                  count={type.count}
                  onSelectGroup={() => handleSelectTipoProcesso(type.name)}
                />
              ))}
            </div>
          </div>
        )}

        {groupCounts.grupoProcesso.length === 0 && groupCounts.tipoProcesso.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">
            Nenhum grupo disponível
          </div>
        )}
      </ScrollArea>
    </div>
  );
}