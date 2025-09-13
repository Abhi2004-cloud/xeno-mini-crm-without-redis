import Providers from "./providers";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "Xeno Mini CRM",
  description: "Mini CRM with campaigns & AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">
        <Providers>{children}</Providers>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
