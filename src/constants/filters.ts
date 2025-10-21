// constants/filters.ts

import { FilterOption } from '@/types/filter.types';

export const AVAILABLE_FILTERS: FilterOption[] = [
  // ============ DATAS ============
  {
    id: 'dt_protocolo',
    label: 'Data do Protocolo',
    field: 'dt_protocolo_tdt',
    type: 'date-range',
    helperText: 'Padrão: DD/MM/YYYY'
  },
  {
    id: 'dt_juntada',
    label: 'Data da Juntada',
    field: 'dt_juntada_tdt',
    type: 'date-range',
    helperText: 'Padrão: DD/MM/YYYY'
  },
  {
    id: 'dt_registro',
    label: 'Data de Registro',
    field: 'dt_registro_tdt',
    type: 'date-range',
    helperText: 'Padrão: DD/MM/YYYY'
  },
  {
    id: 'dt_anexacao',
    label: 'Data de Anexação',
    field: 'dt_anexacao_tdt',
    type: 'date-range',
    helperText: 'Padrão: DD/MM/YYYY'
  },
  
  // ============ AUTOCOMPLETE ============
  {
    id: 'tipo_documento',
    label: 'Tipo Documento',
    field: 'tipo_documento_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'unidade_origem',
    label: 'Unidade Origem',
    field: 'unidade_origem_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'equipe_origem',
    label: 'Equipe Origem',
    field: 'equipe_origem_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'tipo_processo',
    label: 'Tipo Processo',
    field: 'tipo_processo_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'subtipo_processo',
    label: 'Subtipo Processo',
    field: 'subtipo_processo_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'tributo_act',
    label: 'Tributo ACT',
    field: 'tributo_act_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'alegacoes_recurso',
    label: 'Alegações no Recurso',
    field: 'alegacoes_recurso_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'unidade_atual',
    label: 'Unidade Atual',
    field: 'nome_unidade_atual_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'equipe_atual',
    label: 'Equipe Atual',
    field: 'nome_equipe_atual_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'grupo_processo',
    label: 'Grupo Processo',
    field: 'grupo_processo_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'situacao_processo',
    label: 'Situação Processo',
    field: 'situacao_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'result_julgamento_drj_1',
    label: 'Result Julgamento DRJ nível 1',
    field: 'result_julgamento_drj_nivel_1_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  {
    id: 'result_julgamento_drj_2',
    label: 'Result Julgamento DRJ nível 2',
    field: 'result_julgamento_drj_nivel_2_s',
    type: 'autocomplete',
    placeholder: 'Digite para buscar...'
  },
  
  // ============ TEXTO LIVRE ============
  {
    id: 'cpf_responsavel',
    label: 'CPF Responsável',
    field: 'cpf_responsavel_s',
    type: 'text',
    placeholder: 'Digite o CPF...'
  },
  {
    id: 'nome_usuario_juntada',
    label: 'Nome Usuário Juntada',
    field: 'nome_usuario_juntada_doc_s',
    type: 'text',
    placeholder: 'Digite o nome...'
  },
  {
    id: 'ni_contribuinte',
    label: 'NI Contribuinte',
    field: 'ni_contribuinte_s',
    type: 'text',
    placeholder: 'Digite CPF/CNPJ...'
  },
  {
    id: 'assuntos_objetos',
    label: 'Assuntos/Objetos',
    field: 'assuntos_objetos_s',
    type: 'text',
    placeholder: 'Digite o assunto...'
  },
  {
    id: 'titulo_documento',
    label: 'Título Documento',
    field: 'titulo_s',
    type: 'text',
    placeholder: 'Digite o título...'
  },
  {
    id: 'nr_processo',
    label: 'Nr Processo',
    field: 'processo_s',
    type: 'text',
    placeholder: 'Digite o número do processo...'
  },
  {
    id: 'nr_doc_principal',
    label: 'Nr Doc Principal',
    field: 'nr_doc_principal_s',
    type: 'text',
    placeholder: 'Digite o número...'
  },
  {
    id: 'nome_contribuinte',
    label: 'Nome do Contribuinte',
    field: 'nome_contribuinte_s',
    type: 'text',
    placeholder: 'Digite o nome...'
  },
  {
    id: 'nome_relator_drj',
    label: 'Nome Relator DRJ',
    field: 'nome_relator_drj_s',
    type: 'text',
    placeholder: 'Digite o nome...'
  },
  
  // ============ RANGE NUMÉRICO ============
  {
    id: 'valor_processo',
    label: 'Valor Processo',
    field: 'valor_processo_d',
    type: 'number-range',
    placeholder: 'De / Até'
  }
];

// Mapa para buscar filtro por ID rapidamente
export const FILTERS_MAP = AVAILABLE_FILTERS.reduce((acc, filter) => {
  acc[filter.id] = filter;
  return acc;
}, {} as Record<string, FilterOption>);

// Agrupa filtros por categoria para organizar na UI
export const FILTER_GROUPS = {
  datas: {
    label: 'Datas',
    filters: AVAILABLE_FILTERS.filter(f => f.type === 'date-range')
  },
  processo: {
    label: 'Processo',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['tipo_processo', 'subtipo_processo', 'grupo_processo', 'situacao_processo', 'nr_processo', 'valor_processo'].includes(f.id)
    )
  },
  documento: {
    label: 'Documento',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['tipo_documento', 'titulo_documento', 'nr_doc_principal'].includes(f.id)
    )
  },
  unidades: {
    label: 'Unidades e Equipes',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['unidade_origem', 'unidade_atual', 'equipe_origem', 'equipe_atual'].includes(f.id)
    )
  },
  contribuinte: {
    label: 'Contribuinte',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['nome_contribuinte', 'ni_contribuinte', 'cpf_responsavel'].includes(f.id)
    )
  },
  tributario: {
    label: 'Tributário',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['tributo_act', 'assuntos_objetos'].includes(f.id)
    )
  },
  julgamento: {
    label: 'Julgamento',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['result_julgamento_drj_1', 'result_julgamento_drj_2', 'alegacoes_recurso', 'nome_relator_drj'].includes(f.id)
    )
  },
  outros: {
    label: 'Outros',
    filters: AVAILABLE_FILTERS.filter(f => 
      ['nome_usuario_juntada'].includes(f.id)
    )
  }
};