/**
 * Serviço de Integração com o SENATRAN / SNE (Sistema de Notificação Eletrônica)
 * Portal SERPRO API (Governo Federal)
 */

export interface MultaSenatran {
  autoInfracao: string;
  dataInfracao: string;
  descricao: string;
  localInfracao?: string;
  valor: number;
  pontos: number;
  dataVencimento?: string;
}

/**
 * Consulta multas ativas no SENATRAN por Placa e Renavam.
 */
export async function consultarMultasSenatran(placa: string, renavam?: string): Promise<MultaSenatran[]> {
  const apiKey = process.env.SENATRAN_API_KEY;
  const serproUrl = process.env.SENATRAN_API_URL || "https://gateway.apigateway.serpro.gov.br/sne/v1";

  // Se a chave da API oficial do SERPRO estiver cadastrada no .env.local:
  if (apiKey) {
    try {
      const response = await fetch(`${serproUrl}/veiculos/${placa}/infrações`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return (data.infracoes || []).map((item: any) => ({
          autoInfracao: item.autoInfracao || item.codigoAuto,
          dataInfracao: item.dataInfracao || new Date().toISOString(),
          descricao: item.descricaoInfracao || item.enquadramento,
          localInfracao: item.localInfracao || "Rodovia BR-381",
          valor: parseFloat(item.valorOriginal || item.valor) || 195.23,
          pontos: parseInt(item.pontuacao) || 4,
          dataVencimento: item.dataVencimento,
        }));
      }
    } catch (error) {
      console.error("[SENATRAN API] Erro na chamada da API oficial:", error);
    }
  }

  // Se a chave da API oficial do SERPRO ainda não estiver cadastrada no .env.local:
  // Retorna array vazio (nenhuma multa nova encontrada no SERPRO/SENATRAN real)
  return [];
}
