// src/services/api.ts

import type { AppliedFilter, DateRangeValue, NumberRangeValue } from '@/types/filter.types';
import type { Document, SolrResponse } from '@/types/document.types';
import { FILTERS_MAP } from '@/constants/filters';
import { MOCK_DOCUMENTS, generateFacetsFromDocuments } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'; // Controla se usa mock ou não
const SOLR_BASE_URL = import.meta.env.VITE_SOLR_URL || 'http://localhost:8983/solr';
const SOLR_CORE = import.meta.env.VITE_SOLR_CORE || 'eprocesso';

/**
 * Constrói o filter query (fq) do Solr baseado nos filtros aplicados
 */
function buildFilterQuery(filters: AppliedFilter[]): string[] {
  return filters.map(filter => {
    const { field, value } = filter;
    const filterDef = FILTERS_MAP[filter.id];
    
    if (!filterDef) return '';
    
    // Array de valores (multiselect/autocomplete múltiplo) - usa OR
    if (Array.isArray(value)) {
      const values = value.map(v => `"${v}"`).join(' OR ');
      return `${field}:(${values})`;
    }
    
    // Date Range
    if (filterDef.type === 'date-range' && typeof value === 'object') {
      const range = value as DateRangeValue;
      const from = range.from ? range.from : '*';
      const to = range.to ? range.to : '*';
      return `${field}:[${from} TO ${to}]`;
    }
    
    // Number Range
    if (filterDef.type === 'number-range' && typeof value === 'object') {
      const range = value as NumberRangeValue;
      const from = range.from !== undefined ? range.from : '*';
      const to = range.to !== undefined ? range.to : '*';
      return `${field}:[${from} TO ${to}]`;
    }
    
    // Texto simples
    return `${field}:"${value}"`;
  }).filter(fq => fq !== ''); // Remove vazios
}

/**
 * Filtra documentos mockados baseado na query e filtros
 */
function filterMockDocuments(
  query: string,
  filters: AppliedFilter[]
): Document[] {
  let filtered = [...MOCK_DOCUMENTS];
  
  // Filtra por query nos campos específicos
  if (query && query !== '*:*') {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.nome_arquivo_s?.toLowerCase().includes(lowerQuery) ||
      doc.titulo_s?.toLowerCase().includes(lowerQuery) ||
      doc.conteudo_txt?.toLowerCase().includes(lowerQuery) ||
      doc.nome_contribuinte_s?.toLowerCase().includes(lowerQuery) ||
      doc.processo_s?.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Aplica filtros
  filters.forEach(filter => {
    const filterDef = FILTERS_MAP[filter.id];
    if (!filterDef) return;
    
    filtered = filtered.filter(doc => {
      const docValue = doc[filterDef.field as keyof Document];
      
      if (Array.isArray(filter.value)) {
        return filter.value.includes(docValue as string);
      }
      
      if (typeof filter.value === 'string') {
        return docValue?.toString().toLowerCase().includes(filter.value.toLowerCase());
      }
      
      return true;
    });
  });
  
  return filtered;
}

/**
 * Busca documentos no Solr (ou mock)
 */
export async function searchDocuments(
  query: string,
  filters: AppliedFilter[],
  page: number = 1,
  pageSize: number = 20
): Promise<{
  documents: Document[];
  total: number;
  facets: Record<string, Array<string | number>>;
}> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (USE_MOCK) {
  // Usa dados mockados
    const filtered = filterMockDocuments(query, filters);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    
    // Gera facetas dinamicamente dos documentos filtrados
    const dynamicFacets = generateFacetsFromDocuments(filtered);
    
    return {
      documents: paged,
      total: filtered.length,
      facets: dynamicFacets // ← Mudança aqui
    };
  }
  
  // Usa Solr real
  const start = (page - 1) * pageSize;
  const fq = buildFilterQuery(filters);
  
  const params = new URLSearchParams({
    q: query || '*:*',
    start: start.toString(),
    rows: pageSize.toString(),
    wt: 'json',
    'facet': 'true',
    'facet.limit': '50',
    'facet.mincount': '1',
    'fl': 'id,processo_s,tipo_processo_s,subtipo_processo_s,grupo_processo_s,nome_arquivo_s,titulo_s,tipo_documento_s,situacao_s,dt_juntada_tdt,nome_contribuinte_s,ni_contribuinte_s,unidade_origem_s,nome_usuario_juntada_doc_s,tamanho_l,score'
  });
  
  params.append('facet.field', 'grupo_processo_s');
  params.append('facet.field', 'tipo_processo_s');
  
  fq.forEach(filter => params.append('fq', filter));
  
  const response = await fetch(
    `${SOLR_BASE_URL}/${SOLR_CORE}/select?${params.toString()}`
  );
  
  if (!response.ok) {
    throw new Error(`Erro na busca: ${response.statusText}`);
  }
  
  const data: SolrResponse = await response.json();
  
  return {
    documents: data.response.docs,
    total: data.response.numFound,
    facets: data.facet_counts?.facet_fields || {}
  };
}

/**
 * Processa facetas do Solr para formato do sidebar
 */
export function processFacets(facets: Record<string, Array<string | number>>) {
  const grupoProcesso = processFacetField(facets.grupo_processo_s || []);
  const tipoProcesso = processFacetField(facets.tipo_processo_s || []);
  
  return {
    grupoProcesso,
    tipoProcesso
  };
}

function processFacetField(facetArray: Array<string | number>): Array<{ name: string; count: number }> {
  const result = [];
  
  // Solr retorna [nome, count, nome, count, ...]
  for (let i = 0; i < facetArray.length; i += 2) {
    result.push({
      name: String(facetArray[i]),
      count: Number(facetArray[i + 1])
    });
  }
  
  return result.sort((a, b) => b.count - a.count);
}