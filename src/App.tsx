import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";
import PaymentsPage from "./pages/PaymentsPage";
import MerchantListPage from "./pages/MerchantListPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/common/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 레이아웃 */}
        <Route element={<Layout />}>
          {/* 대시보드 페이지 */}
          <Route path="/dashboard" element={<DashBoardPage />} />

          {/* 거래 내역 페이지 */}
          <Route path="/payments" element={<PaymentsPage />} />

          {/* 가맹점 조회 페이지 */}
          <Route path="/merchants" element={<MerchantListPage />} />

          {/* 거래 정산 페이지: 통합되어 더 이상 별도 페이지 없음 */}

          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 설정 페이지 */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* 홈 또는 기본 페이지 설정 */}
          <Route path="/" element={<DashBoardPage />} />
          {/* 기본 페이지를 대시보드로 설정 */}
        </Route>

        {/* <Route path="*" element={<NotFoundPage />} /> */}
        {/* 404페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
