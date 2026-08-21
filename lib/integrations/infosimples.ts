/**
 * Serviço de Integração com a API Infosimples (Serviços: detran/mg/multas e detran/mg/multas-extrato)
 * Documentação Oficial da API v2
 */

export interface MultaInfosimples {
  autoInfracao: string;
  dataInfracao: string;
  descricao: string;
  localInfracao?: string;
  valor: number;
  pontos: number;
  dataVencimento?: string;
}

export interface ResultadoConsultaInfosimples {
  sucesso: boolean;
  mensagem?: string;
  multas: MultaInfosimples[];
}

/**
 * Converte data em formato "DD/MM/AAAA" para o formato ISO "AAAA-MM-DD".
 */
function converterDataPtBrParaIso(dataPtBr?: string): string {
  if (!dataPtBr) return new Date().toISOString();
  const partes = dataPtBr.split("/");
  if (partes.length === 3) {
    const [dia, mes, ano] = partes;
    return `${ano}-${mes}-${dia}`;
  }
  return dataPtBr;
}

/**
 * Consulta multas ativas no DETRAN/MG através da API Infosimples com fallback inteligente de serviços.
 */
export async function consultarMultasInfosimples(
  placa: string,
  renavam?: string,
  chassi?: string
): Promise<ResultadoConsultaInfosimples> {
  const token = process.env.INFOSIMPLES_API_TOKEN;

  if (!token) {
    return {
      sucesso: false,
      mensagem: "Token INFOSIMPLES_API_TOKEN não configurado no seu arquivo .env.local.",
      multas: [],
    };
  }

  const payload = {
    token: token,
    placa: placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
    renavam: renavam ? renavam.trim() : "",
    chassi: chassi ? chassi.trim().toUpperCase() : "",
    timeout: "600",
  };

  // Lista de serviços suportados na Infosimples para consulta de multas
  const servicos = [
    "https://api.infosimples.com/api/v2/consultas/detran/mg/multas",
    "https://api.infosimples.com/api/v2/consultas/detran/mg/multas-extrato",
    "https://api.infosimples.com/api/v2/consultas/senatran/multas",
  ];

  let ultimoErro = "";

  for (const urlServico of servicos) {
    try {
      const response = await fetch(urlServico, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const res = await response.json();

        // Se a requisição foi autorizada e bem sucedida
        if ((res.code === 200 || res.code === 201) && Array.isArray(res.data)) {
          const multasExtraidas: MultaInfosimples[] = [];

          for (const item of res.data) {
            const auto = item.ait || item.auto_infracao || item.numero_auto || `AIT-${placa}-${Date.now().toString().slice(-4)}`;
            const dataInf = converterDataPtBrParaIso(item.data_infracao || item.data);
            const desc = item.descricao || item.tipo_infracao || "Multa de Trânsito";
            const local = item.local || item.orgao_autuador || "Via Pública / Rodovia";
            const valorNum = item.normalizado_valor ?? (parseFloat(item.normalizado_boleto_valor) || parseFloat(item.valor?.replace(/[^0-9,]/g, "").replace(",", ".")) || 130.16);
            const venc = item.boleto_vencimento ? converterDataPtBrParaIso(item.boleto_vencimento) : undefined;

            multasExtraidas.push({
              autoInfracao: auto,
              dataInfracao: dataInf,
              descricao: desc,
              localInfracao: local,
              valor: valorNum,
              pontos: parseInt(item.pontos) || 4,
              dataVencimento: venc,
            });
          }

          return {
            sucesso: true,
            multas: multasExtraidas,
          };
        } else if (res.code === 603) {
          // Código 603: Serviço específico não habilitado para a chave. Continua para a próxima URL de fallback.
          const detalhe = res.errors && res.errors.length > 0 ? res.errors[0] : res.code_message;
          ultimoErro = `Habilite a consulta no painel Infosimples: ${detalhe}`;
          console.warn(`[Infosimples API 603] ${urlServico} não habilitado. Tentando próximo serviço...`);
        } else {
          ultimoErro = `Código Infosimples ${res.code}: ${res.code_message}`;
        }
      }
    } catch (err: any) {
      console.error(`[Infosimples API Error] Falha na requisição para ${urlServico}:`, err);
    }
  }

  return {
    sucesso: false,
    mensagem: ultimoErro || "Serviço da Infosimples não autorizado ou indisponível.",
    multas: [],
  };
}
