import React, { useState } from 'react';
import type { Document } from '@/types/document.types';
import { FileText, Eye, Download, ChevronDown, ChevronRight, Calendar, User, Building2, FileType, Hash, Lock, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TableRowProps {
  document: Document;
  highlightTerm?: string;
  onPreview?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

function highlightText(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 font-semibold px-0.5">
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
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`;
  };

  const InfoSection = ({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{title}</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="text-xs font-medium text-gray-500 min-w-[140px]">{label}:</span>
      <span className="text-sm text-gray-900 break-words">
        {highlight && highlightTerm ? highlightText(value || '-', highlightTerm) : (value || '-')}
      </span>
    </div>
  );

  const titulo = document.titulo_s || document.nome_arquivo_s || 'Sem título';
  const processo = document.processo_s || '-';
  const contribuinte = document.nome_contribuinte_s || '-';
  const situacao = document.situacao_s || '-';
  const ni = document.ni_contribuinte_s;

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(document);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(document);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 border-b transition-colors group cursor-pointer">
        <td className="px-4 py-3" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            )}
            <FileText className="h-4 w-4 text-blue-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {highlightText(titulo, highlightTerm)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 truncate">
                  {document.tipo_documento_s || '-'}
                </span>
                {document.indicador_sigilo_s === 'S' && (
                  <Lock className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="font-mono text-xs">
            {highlightText(processo, highlightTerm)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
            {document.tipo_processo_s}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="font-medium truncate max-w-[200px]">
            {highlightText(contribuinte, highlightTerm)}
          </div>
          {ni && (
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              {highlightText(ni, highlightTerm)}
            </div>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="text-xs">
            {formatDate(document.dt_juntada_tdt)}
          </div>
        </td>
        <td className="px-4 py-3" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {highlightText(situacao, highlightTerm)}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePreview}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Visualizar"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-4 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Informações do Documento */}
              <InfoSection title="Documento" icon={FileType}>
                <InfoItem label="Nome do Arquivo" value={document.nome_arquivo_s} highlight />
                <InfoItem label="Tipo" value={document.tipo_documento_s} />
                <InfoItem label="Tamanho" value={formatBytes(document.tamanho_l)} />
                <InfoItem label="Situação" value={document.situacao_s} highlight />
                <div className="flex gap-3 mt-2 flex-wrap">
                  {document.indicador_sigilo_s === 'S' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                      <Lock className="h-3 w-3" />
                      Sigiloso
                    </span>
                  )}
                  {document.indicador_pesquisavel_s === 'S' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      <Shield className="h-3 w-3" />
                      Pesquisável
                    </span>
                  )}
                  {document.arquivo_indexado_s === 'S' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      <Hash className="h-3 w-3" />
                      Indexado
                    </span>
                  )}
                </div>
              </InfoSection>

              {/* Datas */}
              <InfoSection title="Datas" icon={Calendar}>
                <InfoItem label="Juntada" value={formatDate(document.dt_juntada_tdt)} />
                <InfoItem label="Protocolo" value={formatDate(document.dt_protocolo_tdt)} />
                <InfoItem label="Registro" value={formatDate(document.dt_registro_tdt)} />
                <InfoItem label="Anexação" value={formatDate(document.dt_anexacao_tdt)} />
                <InfoItem label="Última Atualização" value={formatDate(document.atualizado_anexos_dt)} />
              </InfoSection>

              {/* Processo */}
              <InfoSection title="Processo" icon={FileText}>
                <InfoItem label="Número" value={document.processo_s} highlight />
                <InfoItem label="Tipo" value={document.tipo_processo_s} highlight />
                <InfoItem label="Subtipo" value={document.subtipo_processo_s} />
                <InfoItem label="Grupo" value={document.grupo_processo_s} />
                <InfoItem label="Assuntos" value={document.assuntos_objetos_s} highlight />
              </InfoSection>

              {/* Contribuinte */}
              <InfoSection title="Contribuinte" icon={User}>
                <InfoItem label="Nome" value={document.nome_contribuinte_s} highlight />
                <InfoItem label="NI" value={document.ni_contribuinte_s} highlight />
                <InfoItem label="CPF Responsável" value={document.cpf_responsavel_s} />
                <InfoItem label="Usuário Juntada" value={document.nome_usuario_juntada_doc_s} />
              </InfoSection>

              {/* Unidade/Equipe */}
              <InfoSection title="Unidade e Equipe" icon={Building2}>
                <InfoItem label="Unidade Origem" value={document.unidade_origem_s} />
                <InfoItem label="Unidade Atual" value={document.nome_unidade_atual_s} />
                <InfoItem label="Equipe Origem" value={document.equipe_origem_s} />
                <InfoItem label="Equipe Atual" value={document.nome_equipe_atual_s} />
              </InfoSection>

              {/* ACT */}
              <InfoSection title="Informações ACT" icon={Hash}>
                <InfoItem label="Código ACT" value={document.codigo_act_s} />
                <InfoItem label="Origem" value={document.origem_act_s} />
                <InfoItem label="Tema" value={document.nome_tema_act_s} />
                <InfoItem label="Tributo" value={document.tributo_act_s} />
                <InfoItem label="Atividade Origem" value={document.atividade_origem_s} />
              </InfoSection>

            </div>

            {/* Links de Acesso */}
            {(document.urlHcpPrincipal_s || document.urlHcpSecundario_s) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {document.urlHcpPrincipal_s && (
                    <a
                      href={document.urlHcpPrincipal_s}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Acessar HCP Principal
                    </a>
                  )}
                  {document.urlHcpSecundario_s && (
                    <a
                      href={document.urlHcpSecundario_s}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Acessar HCP Secundário
                    </a>
                  )}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}