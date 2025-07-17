import "@/app/global.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";
import { getBarangayInfoServer } from "@/lib";
import { FloatingTrackModal } from "../components";

export async function generateMetadata() {
  const barangayInfo = await getBarangayInfoServer();
  const barangayName = barangayInfo.name;

  return {
    title: {
      template: `%s | Barangay ${barangayName}`,
      default: `Barangay ${barangayName}`,
    },
    description: `Official Complaint Reporting Page of Barangay ${barangayName}`,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <FloatingTrackModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
