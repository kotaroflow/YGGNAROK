export const dynamic = "force-dynamic";

type OAuthSearchParams = {
  code?: string | string[];
  state?: string | string[];
  error?: string | string[];
};

function hasValue(value: string | string[] | undefined) {
  return typeof value === "string" && value.length > 0;
}

export default async function MercadoLivreOAuthPage({
  searchParams,
}: {
  searchParams: Promise<OAuthSearchParams>;
}) {
  const { code, state, error } = await searchParams;
  const authorizationReceived = hasValue(code);
  const authorizationError = hasValue(error);

  // The parameters are intentionally used only to select a local status.
  // They are never rendered, logged, sent elsewhere, or exchanged for tokens.
  void state;

  const title = authorizationReceived
    ? "Autorização recebida"
    : authorizationError
      ? "A autorização não foi concluída"
      : "Aguardando autorização";
  const message = authorizationReceived
    ? "Você pode voltar para a YGGNAROK. Nenhum token foi criado nesta página."
    : authorizationError
      ? "Volte para a YGGNAROK e tente novamente quando estiver pronto."
      : "Esta é a página de retorno segura da integração com o Mercado Livre.";

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111a] px-6 py-12 text-white">
      <section className="w-full max-w-md border border-cyan-300/40 bg-[#0b1924] p-8 shadow-[0_0_48px_rgba(34,211,238,0.12)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
          YGGNAROK · Mercado Livre
        </p>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-base font-normal leading-7 text-slate-200">{message}</p>
      </section>
    </main>
  );
}
