// src/components/results/ResultsTable/TableRow.tsx

import type { Document } from '@/types/document.types';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TableRowProps {
  document: Document;
}

export default function TableRow({ document }: TableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  return (
    <tr className="hover:bg-gray-50 cursor-pointer border-b transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {document.titulo_s || document.nome_arquivo_s || 'Sem título'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {document.tipo_documento_s || '-'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {document.processo_s || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-xs truncate">
          {document.tipo_processo_s || '-'}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-xs">
          <div className="truncate font-medium">
            {document.nome_contribuinte_s || '-'}
          </div>
          {document.ni_contribuinte_s && (
            <div className="text-xs text-gray-500 truncate">
              {document.ni_contribuinte_s}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(document.dt_juntada_tdt)}
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">
          {document.situacao_s || '-'}
        </Badge>
      </td>
    </tr>
  );
}