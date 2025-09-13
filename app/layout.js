import Providers from "./providers.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";

export const metadata = {
  title: "Xeno Mini CRM",
  description: "Mini CRM with campaigns & AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>

        {/* Load Bootstrap JS properly */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

