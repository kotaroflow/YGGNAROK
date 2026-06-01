"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";

const ConfiguracoesClient = dynamic(() => import("./client").then(mod => mod.ConfiguracoesClient), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Carregando configurações...</div>
});

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando configurações...</div>}>
        <ConfiguracoesClient />
      </Suspense>
    </AppShell>
  );
}
