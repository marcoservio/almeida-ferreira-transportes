import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consultarMultasSenatran } from "@/lib/integrations/senatran";

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Buscar todos os veículos cadastrados na frota
    const { data: veiculos, error: veicErr } = await supabase
      .from("veiculos")
      .select("id, placa, renavam")
      .eq("ativo", true);

    if (veicErr || !veiculos || veiculos.length === 0) {
      return NextResponse.json(
        { mensagem: "Nenhum veículo cadastrado na frota para consultar no SENATRAN." },
        { status: 400 }
      );
    }

    let totalNovasMultas = 0;

    // 2. Iterar por cada veículo e consultar no SENATRAN
    for (const v of veiculos) {
      const multasSenatran = await consultarMultasSenatran(v.placa, v.renavam || undefined);

      for (const m of multasSenatran) {
        // Verificar se a multa já foi cadastrada pelo auto de infração
        const { data: existe } = await supabase
          .from("multas")
          .select("id")
          .eq("auto_infracao", m.autoInfracao)
          .maybeSingle();

        if (!existe) {
          await supabase.from("multas").insert({
            veiculo_id: v.id,
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

    return NextResponse.json({
      sucesso: true,
      mensagem: `Sincronização concluída com sucesso! ${totalNovasMultas} nova(s) multa(s) importada(s) do SENATRAN.`,
      novasMultas: totalNovasMultas,
    });
  } catch (error: any) {
    console.error("[API SENATRAN] Erro na sincronização:", error);
    return NextResponse.json({ erro: error.message || "Erro na sincronização" }, { status: 500 });
  }
}
