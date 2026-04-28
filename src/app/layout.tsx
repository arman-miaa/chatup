import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "ChatUp - Real-time Messaging",
    template: "%s | ChatUp",
  },
  description: "ChatUp is a real-time messaging platform with WebSocket support. Chat instantly with friends, see online status, edit & delete messages, and more.",
  keywords: ["chat", "messaging", "real-time", "websocket", "online chat", "ChatUp", "instant messaging"],
  authors: [{ name: "Arman", url: "https://github.com/arman-miaa" }],
  creator: "Arman",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chatup-w3gc.onrender.com",
    title: "ChatUp - Real-time Messaging",
    description: "Chat instantly with friends using WebSocket technology. Real-time messaging, online status, edit & delete messages.",
    siteName: "ChatUp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatUp - Real-time Messaging",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatUp - Real-time Messaging",
    description: "Chat instantly with friends using WebSocket technology.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Toaster position="top-center" richColors />
        <NextAuthSessionProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}