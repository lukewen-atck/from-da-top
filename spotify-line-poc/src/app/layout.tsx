import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotify LINE POC",
  description: "LINE Login + Spotify OAuth Integration Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased bg-gradient-dark min-h-screen">
        {children}
      </body>
    </html>
  );
}

