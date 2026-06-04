import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass } from "@/components/field";
import { MediaPreview } from "@/components/media-preview";
import { uploadMediaAsset } from "@/server/actions/media";
import { getMediaAssets, getProfiles } from "@/server/data/dashboard";

type ProfileOption = Awaited<ReturnType<typeof getProfiles>>[number];
type MediaAsset = Awaited<ReturnType<typeof getMediaAssets>>[number];

export default async function MidiasPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const [profiles, assets] = await Promise.all([getProfiles(), getMediaAssets()]);
  const filteredAssets = params.type ? assets.filter((asset) => asset.asset_type === params.type) : assets;

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">創作工房 — Sosaku Kobo</p>
          <h1 className="mt-1 text-2xl font-semibold">Mídias</h1>
          <form action={uploadMediaAsset} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId">
                <option value="">Sem perfil</option>
                {profiles.map((profile: ProfileOption) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select className={inputClass} name="assetType" defaultValue="image">
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
                <option value="audio">Áudio</option>
                <option value="document">Documento</option>
                <option value="generated">Gerado por IA</option>
              </select>
            </Field>
            <Field label="Arquivo"><input className={inputClass} name="file" type="file" required /></Field>
            <button className={buttonClass}>Enviar para R2</button>
          </form>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <h2 className="text-lg font-semibold">Arquivos</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["image", "video", "audio", "document", "generated"].map((type) => (
              <Link key={type} className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href={`/midias?type=${type}`}>{type}</Link>
            ))}
            <Link className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/midias">Todos</Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAssets.length ? filteredAssets.map((asset: MediaAsset) => (
              <article key={asset.id} className="rounded-lg border border-white/70 bg-white/45 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
                <MediaPreview url={asset.public_url} mimeType={asset.mime_type} label={asset.r2_key} />
                <h3 className="mt-3 truncate font-medium">{asset.r2_key}</h3>
                <p className="text-sm text-slate-400 dark:text-stone-500">
                  {asset.asset_type} · {asset.mime_type || "sem mime"} · {formatBytes(asset.size_bytes)}
                </p>
                {asset.public_url ? (
                  <a className="mt-3 inline-block rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href={asset.public_url} target="_blank">
                    Abrir
                  </a>
                ) : null}
              </article>
            )) : <p className="py-8 text-sm text-stone-500">Nenhuma mídia visível para esta sessão.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function formatBytes(value: number | null) {
  if (!value) return "0 B";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}
