import "@/app/global.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";
import { getBarangayInfoServer } from "@/lib";
import { SocketProvider } from "@/context";

export async function generateMetadata() {
  const barangayInfo = await getBarangayInfoServer();
  const barangayName = barangayInfo.name;

  return {
    title: {
      template: `%s | Barangay ${barangayName}`,
      default: `Barangay ${barangayName}`,
    },
    description: `Official Complaint Reporting Page of Barangay ${barangayName}`,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
