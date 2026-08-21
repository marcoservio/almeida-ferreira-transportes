/**
 * Converte erros técnicos do Supabase / PostgreSQL em mensagens humanas amigáveis.
 */
export function formatarErroBanco(error: any): string {
  if (!error) return "Ocorreu um erro desconhecido ao realizar o cadastro.";

  const mensagemOriginal = typeof error === "string" ? error : error.message || error.details || "";

  // 1. Chaves Duplicadas (UNIQUE constraints)
  if (mensagemOriginal.includes("motoristas_cpf_key") || (mensagemOriginal.includes("cpf") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe outro motorista cadastrado com este mesmo CPF.";
  }

  if (mensagemOriginal.includes("motoristas_cnh_numero_key") || (mensagemOriginal.includes("cnh_numero") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe outro motorista cadastrado com este mesmo número de CNH.";
  }

  if (mensagemOriginal.includes("veiculos_placa_key") || (mensagemOriginal.includes("placa") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe um veículo cadastrado com esta mesma Placa.";
  }

  if (mensagemOriginal.includes("veiculos_renavam_key") || (mensagemOriginal.includes("renavam") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe um veículo cadastrado com este mesmo Renavam.";
  }

  if (mensagemOriginal.includes("veiculos_chassi_key") || (mensagemOriginal.includes("chassi") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe um veículo cadastrado com este mesmo Chassi.";
  }

  if (mensagemOriginal.includes("multas_auto_infracao_key") || (mensagemOriginal.includes("auto_infracao") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe uma multa registrada com este mesmo Auto de Infração.";
  }

  if (mensagemOriginal.includes("postos_combustivel_cnpj_key") || (mensagemOriginal.includes("cnpj") && mensagemOriginal.includes("duplicate"))) {
    return "Não foi possível cadastrar: Já existe um posto parceiro cadastrado com este CNPJ.";
  }

  if (mensagemOriginal.includes("codigo_viagem") && mensagemOriginal.includes("duplicate")) {
    return "Não foi possível cadastrar: O código desta viagem já existe no sistema.";
  }

  // 2. Chaves Estrangeiras (FK constraint)
  if (mensagemOriginal.includes("violates foreign key constraint")) {
    return "Não foi possível cadastrar: O veículo ou motorista selecionado não foi encontrado no sistema.";
  }

  // 3. Valores nulos obrigatórios
  if (mensagemOriginal.includes("null value in column")) {
    return "Não foi possível cadastrar: Preencha todos os campos obrigatórios marcados com (*).";
  }

  // Mensagem padrão amigável
  return `Atenção: Não foi possível salvar o cadastro. (${mensagemOriginal})`;
}
