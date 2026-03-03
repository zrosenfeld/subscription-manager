import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "Subscription Manager",
  description: "Optimize your subscriptions and save money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#060708",
          colorInputBackground: "rgba(255,255,255,0.04)",
          colorInputText: "#e5e5e5",
          colorText: "#d4d4d4",
          colorTextSecondary: "#737373",
          colorPrimary: "#22c55e",
          colorDanger: "#ef4444",
          colorNeutral: "#737373",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontFamilyButtons: "var(--font-geist-sans), sans-serif",
        },
        elements: {
          card: "bg-[#060708] border border-white/[0.07] shadow-none",
          headerTitle: "text-neutral-100 font-bold",
          headerSubtitle: "text-neutral-500",
          socialButtonsBlockButton: "border-white/[0.07] bg-white/[0.025] text-neutral-300 hover:bg-white/[0.05]",
          socialButtonsBlockButtonText: "text-neutral-300",
          dividerLine: "bg-white/[0.07]",
          dividerText: "text-neutral-600",
          formFieldLabel: "text-neutral-400",
          formFieldInput: "bg-white/[0.04] border-white/[0.07] text-neutral-100",
          formButtonPrimary: "bg-green-500 hover:bg-green-400 text-[#060708] font-semibold shadow-none",
          footerActionLink: "text-green-500 hover:text-green-400",
          identityPreviewText: "text-neutral-300",
          identityPreviewEditButton: "text-green-500",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
