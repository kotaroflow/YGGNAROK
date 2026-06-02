"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  href?: string;
};

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className="group mb-5 flex items-center gap-1.5 text-xs font-bold text-muted hover:text-brand transition-colors w-fit"
      aria-label={href ? `Ir para ${href}` : "Voltar para a página anterior"}
    >
      <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5 text-muted group-hover:text-brand" />
      <span>{href ? "Voltar ao início" : "Voltar"}</span>
    </button>
  );
}
