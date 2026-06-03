import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted">
        <Loader2 size={24} className="animate-spin" />
        <p className="text-sm font-medium">Carregando...</p>
      </div>
    </div>
  );
}
