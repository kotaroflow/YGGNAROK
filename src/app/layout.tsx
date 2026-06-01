import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YGGNAROK — Plataforma de Criação, IA e Vendas",
    template: "%s | YGGNAROK",
  },
  description: "YGGNAROK: workspace all-in-one para criadores automatizarem conteúdo, vendas, comissões e biblioteca com IA. Gerencie perfis, jobs e postagens num só lugar.",
  keywords: ["YGGNAROK", "criação de conteúdo", "IA", "vendas", "comissões", "biblioteca", "postagem", "workspace criador"],
  authors: [{ name: "YGGNAROK" }],
  openGraph: {
    title: "YGGNAROK — Plataforma de Criação, IA e Vendas",
    description: "Workspace all-in-one para criadores automatizarem conteúdo, vendas e comissões com IA.",
    url: "https://yggnarok.com",
    siteName: "YGGNAROK",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YGGNAROK — Plataforma de Criação, IA e Vendas",
    description: "Workspace all-in-one para criadores automatizarem conteúdo, vendas e comissões com IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("ygn-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.theme=t}catch(e){document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
