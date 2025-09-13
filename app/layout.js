import Providers from "./providers";

export const metadata = {
  title: "Xeno Mini CRM",
  description: "Mini CRM with campaigns & AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

