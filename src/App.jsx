import AuthProvider from "./contexts/AuthContext";
import DoctorProvider from "./contexts/DoctorContext";
import GuardProvider from "./contexts/GuardContext";
import ReportProvider from "./contexts/ReportContext";
import Router from "./components/Router";

function App() {
  return (
    <AuthProvider>
      <DoctorProvider>
        <GuardProvider>
          <ReportProvider>
            <Router />
          </ReportProvider>
        </GuardProvider>
      </DoctorProvider>
    </AuthProvider>
  );
}

export default App;
