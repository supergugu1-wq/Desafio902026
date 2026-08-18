import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {title:"Projeto 90 Dias | Transformação completa",description:"Treino masculino e feminino, academia ou casa, alimentação e evolução em 90 dias."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
