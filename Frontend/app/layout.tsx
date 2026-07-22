import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pathwise - AI Mentor",
  description: "Your AI student mentor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
