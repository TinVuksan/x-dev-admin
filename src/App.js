import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import useAuth from "./hooks/useAuth";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Speakers from "./scenes/speakers";
import Form from "./scenes/addSpeaker";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar";
import Login from "./scenes/login";
import PersistLogin from "./components/PersistLogin/PersistLogin";
import News from "./scenes/news";

function App() {
  const [theme, colorMode] = useMode();
  const { auth } = useAuth();
  console.log(auth);

  return (
    // <div className="app">
    //   <Login />
    // </div>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {auth.email && <Sidebar />}
          <main className="content">
            {auth.email && <Topbar />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth allowedRoles={"ROLE_ADMIN"} />}>
                  <Route path="home" element={<Dashboard />} />
                  <Route path="team" element={<Team />} />
                  <Route path="speakers" element={<Speakers />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="form" element={<Form />} />
                  <Route path="news" element={<News />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="geography" element={<Geography />} />
                </Route>
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
