import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { RequireAuth } from "./app/RequireAuth";
import { Donations } from "./pages/Donations";
import { History } from "./pages/History";
import { Locations } from "./pages/Locations";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { OrdersToday } from "./pages/OrdersToday";
import { Settings } from "./pages/Settings";
import { Sms } from "./pages/Sms";
import { TodaySetup } from "./pages/TodaySetup";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodaySetup />} />
          <Route path="/orders" element={<OrdersToday />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/history" element={<History />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/sms" element={<Sms />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
