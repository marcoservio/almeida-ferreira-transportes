export type UserRole = 'ADMIN' | 'OPERACIONAL' | 'FINANCEIRO';
export type TipoVeiculo = 'CAVALO' | 'CARRETA' | 'TRUCK' | 'UTILITARIO';
export type TipoCarreta = 'BAU_SECO' | 'BAU_FRIGORIFICO' | 'SIDER' | 'PRANCHA' | 'OUTRO';
export type StatusVeiculo = 'DISPONIVEL' | 'EM_VIAGEM' | 'MANUTENCAO' | 'INATIVO';
export type StatusViagem = 
  | 'GARAGEM' 
  | 'SAIU_GARAGEM' 
  | 'EM_TRANSITO' 
  | 'CHEGOU_DESTINO' 
  | 'CARREGANDO_DESCARREGANDO' 
  | 'EM_RETORNO' 
  | 'CONCLUIDA' 
  | 'CANCELADA';
export type TipoPagamento = 'A_VISTA' | 'A_PRAZO';
export type StatusMulta = 'PENDENTE' | 'PAGA' | 'RECURSO' | 'CANCELADA';

export interface UsuarioAdm {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  trocar_senha_proximo_acesso: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Motorista {
  id: number;
  nome: string;
  cpf: string;
  rg?: string;
  telefone: string;
  cnh_numero: string;
  cnh_categoria: string;
  cnh_vencimento: string;
  chave_pix?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Veiculo {
  id: number;
  placa: string;
  tipo: TipoVeiculo;
  tipo_carreta?: TipoCarreta;
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo?: number;
  chassi: string;
  renavam: string;
  cor?: string;
  combustivel?: string;
  categoria?: string;
  exercicio_crlv?: number;
  crlv_vencimento?: string;
  antt_vencimento?: string;
  checklist_krona_vencimento?: string;
  motorista_id?: number;
  status: StatusVeiculo;
  hodometro_atual: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  motorista?: Motorista;
}

export interface VinculoConjunto {
  id: number;
  motorista_id: number;
  cavalo_id: number;
  carreta_id?: number;
  data_inicio: string;
  data_fim?: string;
  ativo: boolean;
  created_at: string;
  // Joins opcionais
  motorista?: Motorista;
  cavalo?: Veiculo;
  carreta?: Veiculo;
}

export interface Viagem {
  id: number;
  codigo_viagem: string;
  motorista_id: number;
  cavalo_id: number;
  carreta_id?: number;
  origem: string;
  destino: string;
  cliente_nome?: string;
  carga_descricao?: string;
  peso_toneladas?: number;
  status: StatusViagem;
  data_saida_prevista?: string;
  data_saida_real?: string;
  data_chegada_prevista?: string;
  data_chegada_real?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Joins
  motorista?: Motorista;
  cavalo?: Veiculo;
  carreta?: Veiculo;
  checklist?: ViagemLiberacaoChecklist;
}

export interface ViagemLiberacaoChecklist {
  id: number;
  viagem_id: number;
  step_cte_emitido: boolean;
  step_ciot_gerado: boolean;
  step_ciot_manifesto_sefaz: boolean;
  step_xml_cte_impresso: boolean;
  step_espelhamento_rastreio: boolean;
  step_rota_krona_criada: boolean;
  step_sm_krona_criada: boolean;
  sm_krona_codigo?: string;
  step_foto_motorista_sm_enviada: boolean;
  step_email_ctes_dacte_enviado: boolean;
  liberado_por_usuario_id?: string;
  liberado_em?: string;
  updated_at: string;
}

export interface DocumentoFiscal {
  id: number;
  viagem_id: number;
  numero_cte: string;
  chave_cte?: string;
  numero_mdfe?: string;
  ciot_codigo?: string;
  valor_frete: number;
  xml_url?: string;
  pdf_url?: string;
  created_at: string;
}

export interface PostoCombustivel {
  id: number;
  nome_fantasia: string;
  razao_social?: string;
  cnpj?: string;
  cidade: string;
  uf: string;
  parceiro: boolean;
  created_at: string;
}

export interface Abastecimento {
  id: number;
  veiculo_id: number;
  motorista_id: number;
  posto_id: number;
  viagem_id?: number;
  data_abastecimento: string;
  hodometro_km: number;
  litros: number;
  valor_litro: number;
  valor_total: number;
  tipo_pagamento: TipoPagamento;
  comprovante_url?: string;
  created_at: string;
  // Joins
  veiculo?: Veiculo;
  motorista?: Motorista;
  posto?: PostoCombustivel;
}

export interface Manutencao {
  id: number;
  veiculo_id: number;
  tipo_manutencao: string;
  descricao: string;
  oficina_local?: string;
  hodometro_km: number;
  valor_total: number;
  data_manutencao: string;
  proxima_manutencao_km?: number;
  proxima_manutencao_data?: string;
  created_at: string;
  veiculo?: Veiculo;
}

export interface Multa {
  id: number;
  veiculo_id: number;
  motorista_id?: number;
  auto_infracao: string;
  data_infracao: string;
  descricao: string;
  local_infracao?: string;
  valor: number;
  pontos: number;
  status: StatusMulta;
  data_vencimento?: string;
  created_at: string;
  veiculo?: Veiculo;
  motorista?: Motorista;
}

export interface AcertoViagem {
  id: number;
  viagem_id: number;
  motorista_id: number;
  data_fechamento: string;
  valor_adiantamento: number;
  valor_reembolso_abastecimento: number;
  valor_reembolso_descarga: number;
  valor_venda_pallets: number;
  valor_outras_despesas_avista: number;
  valor_abastecimento_aprazo: number;
  valor_descarga_conta_cliente: number;
  valor_descontos_diversos: number;
  saldo_final: number;
  status_acerto: string;
  observacoes?: string;
  created_at: string;
  viagem?: Viagem;
  motorista?: Motorista;
}

export interface AlertaSistema {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  lido: boolean;
  created_at: string;
}
