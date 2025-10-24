// src/components/results/ResultsTable/TableRow.tsx

import type { Document } from '@/types/document.types';
import { FileText, Eye, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TableRowProps {
  document: Document;
  highlightTerm?: string;
  onPreview?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

// Função para destacar texto
function highlightText(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function TableRow({ 
  document, 
  highlightTerm = '',
  onPreview,
  onDownload 
}: TableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const titulo = document.titulo_s || document.nome_arquivo_s || 'Sem título';
  const processo = document.processo_s || '-';
  const tipoProcesso = document.tipo_processo_s || '-';
  const contribuinte = document.nome_contribuinte_s || '-';
  const ni = document.ni_contribuinte_s;
  const situacao = document.situacao_s || '-';

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(document);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(document);
  };

  return (
    <tr className="hover:bg-gray-50 border-b transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {highlightText(titulo, highlightTerm)}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {document.tipo_documento_s || '-'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {highlightText(processo, highlightTerm)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-xs truncate">
          {highlightText(tipoProcesso, highlightTerm)}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="max-w-xs">
          <div className="truncate font-medium">
            {highlightText(contribuinte, highlightTerm)}
          </div>
          {ni && (
            <div className="text-xs text-gray-500 truncate">
              {highlightText(ni, highlightTerm)}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(document.dt_juntada_tdt)}
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">
          {highlightText(situacao, highlightTerm)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="h-8 w-8 p-0"
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 w-8 p-0"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}