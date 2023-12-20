import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientProviders from "@/components/ClientProviders";
import FirebaseAuthProvider from "@/components/FirebaseAuthProvider";
import SubscriptionProvider from "@/components/SubscriptionProvider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/components/UserContext";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polyglotter",
  description:
    "Connect with people worldwide through easy-to-use, real-time chats translated live in any language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ClientProviders>
        <html lang="en">
          <Head>
            <title>Polyglotter</title>
            <meta
              name="Polyglotter"
              content="Connect with people worldwide through easy-to-use, real-time chats translated live in any language."
            />
            <link rel="icon" href="/favicon.ico" />
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.polyglotter.app/" />
            <meta property="og:title" content="Polyglotter" />
            <meta
              property="og:description"
              content="Connect with people worldwide through easy-to-use, real-time chats translated live in any language."
            />
            <meta
              property="og:image"
              content="https://i.ibb.co/q7hNK4N/Screenshot-2023-12-20-at-21-40-30.png"
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta
              property="twitter:url"
              content="https://www.polyglotter.app/"
            />
            <meta property="twitter:title" content="Polyglotter" />
            <meta
              property="twitter:description"
              content="Connect with people worldwide through easy-to-use, real-time chats translated live in any language."
            />
            <meta
              property="twitter:image"
              content="https://i.ibb.co/q7hNK4N/Screenshot-2023-12-20-at-21-40-30.png"
            />
          </Head>
          <body className="min-h-screen">
            <FirebaseAuthProvider>
              <SubscriptionProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Header />
                  {children}

                  <Toaster />
                </ThemeProvider>
              </SubscriptionProvider>
            </FirebaseAuthProvider>
          </body>
        </html>
      </ClientProviders>
    </UserProvider>
  );
}
