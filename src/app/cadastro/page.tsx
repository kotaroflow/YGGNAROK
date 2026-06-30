import type { Metadata } from "next";
import React, { Suspense } from "react";
import { AuthFloatingPanel } from "@/components/auth/auth-floating-panel";
import { AuthHeroBackground } from "@/components/auth/auth-hero-background";
import { CadastroForm } from "@/components/auth/cadastro-form";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie seu workspace YGGNAROK com segurança via Supabase Auth e RLS. Gerencie conteúdo, IA e vendas num só lugar.",
};

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <AuthHeroBackground />
      <AuthFloatingPanel title="Criar conta" subtitle="Junte-se a plataforma YGGNAROK">
        <CadastroForm />
      </AuthFloatingPanel>
    </Suspense>
  );
}
