import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_TC, JetBrains_Mono, VT323 } from 'next/font/google';

const notoSansTC = Noto_Sans_TC({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-noto-sans',
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
});

const vt323 = VT323({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-vt323',
});

export const metadata: Metadata = {
    title: 'FROM DA ECHO | Challenge',
    description: 'Sony Golden Melody Nostalgia Challenge',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW">
            <body className={`${notoSansTC.variable} ${jetBrainsMono.variable} ${vt323.variable} bg-cyber-black text-white font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
