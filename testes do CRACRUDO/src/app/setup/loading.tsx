export default function SetupLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(120deg,#17111f_0%,#2b1a4a_48%,#f5d76a_100%)] px-6 text-stone-50">
      <section className="w-full max-w-sm rounded-[24px] border border-white/15 bg-white/10 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-amber-300" />
        <h1 className="mt-5 text-lg font-semibold">Preparando workspace</h1>
        <p className="mt-2 text-sm text-stone-200">Criando perfil inicial e sessão segura.</p>
      </section>
    </main>
  );
}
