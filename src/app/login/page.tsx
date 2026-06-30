import type { Metadata } from "next";
import React, { Suspense } from "react";
import { AuthFloatingPanel } from "@/components/auth/auth-floating-panel";
import { AuthHeroBackground } from "@/components/auth/auth-hero-background";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o YGGNAROK — gerencie perfis, trabalhos de IA, biblioteca e fila de postagem num workspace premium.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthHeroBackground />
      <AuthFloatingPanel title="Entrar" subtitle="Acesse sua conta para continuar">
        <LoginForm />
      </AuthFloatingPanel>
    </Suspense>
  );
}
