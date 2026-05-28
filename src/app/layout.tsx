import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "YGGNAROK / YGN V1",
  description: "Sistema limpo para perfis, conteudo, vendas, biblioteca, postagem manual, jobs e logs.",
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
      <body className="min-h-full bg-[#f7f4ee] text-stone-950 dark:bg-[#0e0d10] dark:text-stone-100">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("ygn-theme");document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light"}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
