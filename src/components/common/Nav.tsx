import { useState } from "react";
import { Link } from "react-router-dom";

function Nav() {
  // 모바일 메뉴 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 메뉴 토글 함수
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="text-white text-2xl font-bold">
          <Link to="/">MyApp</Link>
        </div>

        {/* 메뉴 영역 (데스크탑) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="text-white hover:text-accent">
            대시보드
          </Link>
          <Link to="/transactions" className="text-white hover:text-accent">
            거래 내역
          </Link>
          <Link to="/merchants" className="text-white hover:text-accent">
            가맹점 조회
          </Link>
          <Link to="/settings" className="text-white hover:text-accent">
            설정
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 토글 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary text-white p-4 space-y-4">
          <Link to="/dashboard" className="block hover:text-accent">
            대시보드
          </Link>
          <Link to="/transactions" className="block hover:text-accent">
            거래 내역
          </Link>
          <Link to="/merchants" className="block hover:text-accent">
            가맹점 조회
          </Link>
          <Link to="/settings" className="block hover:text-accent">
            설정
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;
