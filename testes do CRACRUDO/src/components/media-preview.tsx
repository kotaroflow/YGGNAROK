/* eslint-disable @next/next/no-img-element */
export function MediaPreview({
  url,
  mimeType,
  label,
}: {
  url: string | null;
  mimeType: string | null;
  label: string;
}) {
  if (!url) {
    return <div className="grid aspect-video place-items-center rounded-lg border border-white/70 bg-white/45 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-neutral-950/35 dark:text-stone-400">Sem URL</div>;
  }

  if (mimeType?.startsWith("image/")) {
    return <img className="aspect-video w-full rounded-md object-cover" src={url} alt={label} />;
  }

  if (mimeType?.startsWith("video/")) {
    return <video className="aspect-video w-full rounded-md bg-black" src={url} controls />;
  }

  if (mimeType?.startsWith("audio/")) {
    return <audio className="w-full" src={url} controls />;
  }

  return <div className="grid aspect-video place-items-center rounded-lg border border-white/70 bg-white/45 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-neutral-950/35 dark:text-stone-400">Arquivo</div>;
}
