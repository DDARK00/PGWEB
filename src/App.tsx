import Nav from "./components/common/Nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoardPage from "./pages/DashBoardPage";
import TransactionsPage from "./pages/TransactionsPage";
import MerchantListPage from "./pages/MerchantListPage";
import TransactionSettlementPage from "./pages/TransactionSettlementPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          {/* 대시보드 페이지 */}
          <Route path="/dashboard" element={<DashBoardPage />} />

          {/* 거래 내역 페이지 */}
          <Route path="/transactions" element={<TransactionsPage />} />

          {/* 가맹점 조회 페이지 */}
          <Route path="/merchants" element={<MerchantListPage />} />

          {/* 거래 정산 페이지 */}
          <Route
            path="/transactions/settlements"
            element={<TransactionSettlementPage />}
          />

          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 설정 페이지 */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* 홈 또는 기본 페이지 설정 */}
          <Route path="/" element={<DashBoardPage />} />

          {/* 기본 페이지를 대시보드로 설정 */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
