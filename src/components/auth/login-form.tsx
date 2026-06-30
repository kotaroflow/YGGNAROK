"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/server/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "credenciais":
        return "E-mail ou senha incorretos.";
      case "validacao":
        return "Verifique os dados informados e tente novamente.";
      case "configuracao":
        return "Erro de configuração no servidor de autenticação.";
      default:
        return "Ocorreu um erro ao tentar entrar. Tente novamente.";
    }
  };

  return (
    <form action={signIn} className="flex flex-col gap-4">
      {errorParam && (
        <div className="rounded-xl bg-red-950/70 border border-red-500/40 p-3.5 text-xs text-red-200 flex items-center gap-2.5 shadow-md">
          <svg
            className="w-4 h-4 text-red-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{getErrorMessage(errorParam)}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
          E-mail
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-zinc-500 pointer-events-none flex items-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Seu e-mail cadastrado"
            className="w-full rounded-xl bg-[#130b24] border border-purple-500/20 px-4 pl-11 py-3 text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-1.5">
          Senha
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-zinc-500 pointer-events-none flex items-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Sua senha de acesso"
            className="w-full rounded-xl bg-[#130b24] border border-purple-500/20 px-4 pl-11 pr-11 py-3 text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-zinc-500 hover:text-white transition focus:outline-none flex items-center"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        <Link
          href="/esqueci-senha"
          className="text-xs text-purple-400 hover:text-purple-300 block text-right mt-2 transition"
        >
          Esqueci minha senha
        </Link>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 mt-2"
      >
        <span>Entrar</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      <Link
        href="/cadastro"
        className="text-xs text-zinc-400 text-center mt-6 block hover:text-white transition"
      >
        Não tem uma conta? Criar conta
      </Link>
    </form>
  );
}

export default LoginForm;
