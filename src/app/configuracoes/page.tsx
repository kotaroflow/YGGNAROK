import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ConfiguracoesClient } from "./client";

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando configurações...</div>}>
        <ConfiguracoesClient />
      </Suspense>
    </AppShell>
  );
}
