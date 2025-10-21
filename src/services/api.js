// services/api.ts

import { AppliedFilter, Document, SolrResponse } from '@/types/document.types';

const SOLR_BASE_URL = process.env.VITE_SOLR_URL || 'http://localhost:8983/solr';
const SOLR_CORE = process.env.VITE_SOLR_CORE || 'eprocesso';

/**
 * Constrói o filter query (fq) do Solr baseado nos filtros aplicados
 */
function buildFilterQuery(filters: AppliedFilter[]): string[] {
  return filters.map(filter => {
    const { field, value } = filter;
    
    // Se for array (multiselect), usa OR
    if (Array.isArray(value)) {
      const values = value.map(v => `"${v}"`).join(' OR ');
      return `${field}:(${values})`;
    }
    
    // Se for texto simples
    return `${field}:"${value}"`;
  });
}

/**
 * Busca documentos no Solr
 */
export async function searchDocuments(
  query: string,
  filters: AppliedFilter[],
  page: number = 1,
  pageSize: number = 20
): Promise<{
  documents: Document[];
  total: number;
  facets: any;
}> {
  const start = (page - 1) * pageSize;
  const fq = buildFilterQuery(filters);
  
  const params = new URLSearchParams({
    q: query || '*:*',
    start: start.toString(),
    rows: pageSize.toString(),
    wt: 'json',
    // Facetas para sidebar
    'facet': 'true',
    'facet.field': ['grupo_processo_s', 'tipo_processo_s'],
    'facet.limit': '50',
    'facet.mincount': '1',
    // Campos retornados
    'fl': 'id,processo_s,tipo_processo_s,subtipo_processo_s,grupo_processo_s,nome_arquivo_s,titulo_s,tipo_documento_s,situacao_s,dt_juntada_tdt,nome_contribuinte_s,ni_contribuinte_s,unidade_origem_s,nome_usuario_juntada_doc_s,tamanho_l,score'
  });
  
  // Adiciona filtros
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
export function processFacets(facets: any) {
  const grupoProcesso = processFacetField(facets.grupo_processo_s || []);
  const tipoProcesso = processFacetField(facets.tipo_processo_s || []);
  
  return {
    grupoProcesso,
    tipoProcesso
  };
}

function processFacetField(facetArray: any[]): Array<{ name: string; count: number }> {
  const result = [];
  
  // Solr retorna [nome, count, nome, count, ...]
  for (let i = 0; i < facetArray.length; i += 2) {
    result.push({
      name: facetArray[i],
      count: facetArray[i + 1]
    });
  }
  
  return result.sort((a, b) => b.count - a.count);
}