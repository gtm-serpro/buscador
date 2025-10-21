// types/document.types.ts

export interface SolrResponse {
  response: {
    numFound: number;        // total de documentos encontrados
    start: number;           // início da paginação
    maxScore: number;
    numFoundExact: boolean;
    docs: Document[];
  };
  responseHeader: {
    status: number;
    QTime: number;
    params: {
      q: string;             // query de busca
      start: string;         // paginação
      fq: string;            // filtros aplicados
      wt: string;            // formato (xml)
    };
  };
}

export interface Document {
  id: string;
  id_l: number;
  
  // Identificação
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
  
  // ACT (Atividade)
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
  
  // Metadados Solr
  _version_: number;
  score: number;
  
  // Responsável
  nome_usuario_juntada_doc_s: string;
}