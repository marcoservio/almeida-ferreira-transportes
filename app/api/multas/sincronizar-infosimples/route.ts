import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consultarMultasInfosimples } from "@/lib/integrations/infosimples";

export async function POST() {
  try {
    const token = process.env.INFOSIMPLES_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Token da Infosimples não encontrado. Cadastre a chave INFOSIMPLES_API_TOKEN no seu arquivo .env.local para ativar a sincronização automatizada.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Buscar todos os veículos ativos da frota
    const { data: veiculos, error: veicErr } = await supabase
      .from("veiculos")
      .select("id, placa, renavam, chassi, motorista_id")
      .eq("ativo", true);

    if (veicErr || !veiculos || veiculos.length === 0) {
      return NextResponse.json(
        { mensagem: "Nenhum veículo cadastrado na frota para consultar na Infosimples." },
        { status: 400 }
      );
    }

    let totalNovasMultas = 0;
    let mensagemErroAutorizacao = "";

    // 2. Iterar e consultar cada caminhão na Infosimples (enviando placa, renavam e chassi)
    for (const v of veiculos) {
      const resultado = await consultarMultasInfosimples(v.placa, v.renavam || undefined, v.chassi || undefined);

      if (!resultado.sucesso && resultado.mensagem) {
        mensagemErroAutorizacao = resultado.mensagem;
      }

      for (const m of resultado.multas) {
        // Verificar se a multa já foi cadastrada previamente
        const { data: existe } = await supabase
          .from("multas")
          .select("id")
          .eq("auto_infracao", m.autoInfracao)
          .maybeSingle();

        if (!existe) {
          await supabase.from("multas").insert({
            veiculo_id: v.id,
            motorista_id: v.motorista_id || null,
            auto_infracao: m.autoInfracao,
            data_infracao: m.dataInfracao,
            descricao: m.descricao,
            local_infracao: m.localInfracao,
            valor: m.valor,
            pontos: m.pontos,
            status: "PENDENTE",
            data_vencimento: m.dataVencimento || null,
          });
          totalNovasMultas++;
        }
      }
    }

    if (mensagemErroAutorizacao && totalNovasMultas === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: mensagemErroAutorizacao,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: `Sincronização Infosimples concluída com sucesso! ${totalNovasMultas} nova(s) multa(s) importada(s).`,
      novasMultas: totalNovasMultas,
    });
  } catch (error: any) {
    console.error("[API Infosimples] Erro na sincronização:", error);
    return NextResponse.json({ erro: error.message || "Erro de conexão com Infosimples" }, { status: 500 });
  }
}
