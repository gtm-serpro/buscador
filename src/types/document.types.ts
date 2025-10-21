// src/types/document.types.ts

export interface Document {
  // IDs
  id: string;
  id_l: number;
  
  // Identificação do Processo
  processo_s: string;
  tipo_processo_s: string;
  subtipo_processo_s: string;
  grupo_processo_s: string;
  
  // Documento
  nome_arquivo_s: string;
  titulo_s: string;
  tipo_documento_s: string;
  situacao_s: string;
  tamanho_l: number;
  
  // Datas
  dt_juntada_tdt: string;
  dt_protocolo_tdt: string;
  dt_registro_tdt: string;
  dt_anexacao_tdt: string;
  atualizado_anexos_dt: string;
  
  // Contribuinte
  nome_contribuinte_s: string;
  ni_contribuinte_s: string;
  cpf_responsavel_s: string;
  
  // Unidades/Equipes
  unidade_origem_s: string;
  nome_unidade_atual_s: string;
  equipe_origem_s: string;
  nome_equipe_atual_s: string;
  
  // ACT
  codigo_act_s: string;
  origem_act_s: string;
  tema_act_s: string;
  nome_tema_act_s: string;
  tributo_act_s: string;
  act_s: string;
  atividade_origem_s: string;
  
  // Assunto
  assuntos_objetos_s: string;
  
  // URLs
  urlHcpPrincipal_s: string;
  urlHcpSecundario_s: string;
  
  // Indicadores
  indicador_sigilo_s: 'S' | 'N';
  indicador_pesquisavel_s: 'S' | 'N';
  indicador_original_pesquisavel_s: 'S' | 'N';
  indicador_gerado_sistema_s: 'S' | 'N';
  arquivo_indexado_s: 'S' | 'N';
  sem_conteudo_s: 'S' | 'N';
  
  // Conteúdo OCR
  conteudo_txt: string;
  
  // Responsável
  nome_usuario_juntada_doc_s: string;
  
  // Metadados Solr
  _version_: number;
  score: number;
}

export interface SolrResponseHeader {
  status: number;
  QTime: number;
  params: {
    q: string;
    start: string;
    fq?: string | string[];
    wt: string;
    rows?: string;
    facet?: string;
    'facet.field'?: string | string[];
    'facet.limit'?: string;
    'facet.mincount'?: string;
    fl?: string;
  };
}

export interface SolrFacetCounts {
  facet_fields: {
    [key: string]: Array<string | number>;
  };
}

export interface SolrResponse {
  responseHeader: SolrResponseHeader;
  response: {
    numFound: number;
    start: number;
    maxScore: number;
    numFoundExact: boolean;
    docs: Document[];
  };
  facet_counts?: SolrFacetCounts;
}