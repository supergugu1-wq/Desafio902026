"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Validando seu acesso...");

  useEffect(() => {
    async function run() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const access_token = hash.get("access_token");
      const refresh_token = hash.get("refresh_token");
      const expires_in = Number(hash.get("expires_in") || 3600);

      if (!access_token || !refresh_token) {
        setMessage("O link expirou ou é inválido. Solicite um novo link de acesso.");
        return;
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token, refresh_token, expires_in }),
      });

      if (!response.ok) {
        setMessage("Não foi possível validar o acesso.");
        return;
      }

      const next = params.get("next") || "/plataforma";
      router.replace(next.startsWith("/") ? next : "/plataforma");
    }

    run();
  }, [params, router]);

  return (
    <main className="blocked-page">
      <div className="blocked-card">
        <span>🔐</span>
        <small>PROJETO 90 DIAS</small>
        <h1>Preparando seu acesso</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}

function CallbackFallback() {
  return (
    <main className="blocked-page">
      <div className="blocked-card">
        <span>🔐</span>
        <small>PROJETO 90 DIAS</small>
        <h1>Preparando seu acesso</h1>
        <p>Carregando...</p>
      </div>
    </main>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
