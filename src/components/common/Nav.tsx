import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

function Nav() {
  // 모바일 메뉴 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 메뉴 항목 데이터 (로그인 시 노출)
  const menuLinks = [
    { title: "대시보드", path: "/dashboard" },
    { title: "거래 내역", path: "/payments" },
    { title: "가맹점 조회", path: "/merchants" },
  ];

  const navigate = useNavigate();
  const [isLoggedIn, _] = useState<boolean>(true);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // 간단한 로그인 상태 확인: 예) localStorage에 'authToken' 존재 여부
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   setIsLoggedIn(Boolean(token));
  // }, []);

  const handleLogout = () => {
    // 토큰 제거 및 상태 업데이트, 로그인 페이지로 이동
    localStorage.removeItem("authToken");
    // setIsLoggedIn(false);
    navigate("/login");
  };

  // 메뉴 토글 함수
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 메뉴 링크 클릭 시 메뉴 닫히도록 처리
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // 메뉴 닫기
  };

  return (
    <nav className="bg-primary relative py-4 shadow-md">
      <div className="container mx-auto px-2 flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="text-white text-2xl font-bold">
          <Link title="메인 페이지" to="/">
            PG_WEB
          </Link>
        </div>

        {/* 메뉴 영역 (데스크탑) */}
        <div className="hidden md:flex space-x-6 items-center">
          {isLoggedIn &&
            menuLinks.map((link) => (
              <NavLink
                key={link.path}
                title={link.title}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-accent font-semibold"
                    : "text-white hover:text-accent"
                }
              >
                {link.title}
              </NavLink>
            ))}

          {/* 로그인/로그아웃 */}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              title="로그인"
              className="ml-4 px-3 py-1 bg-white text-primary rounded cursor-pointer"
            >
              로그인
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              title="로그아웃"
              className="ml-4 px-3 py-1 bg-white text-primary rounded cursor-pointer"
            >
              로그아웃
            </button>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white cursor-pointer"
          >
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
        <div className="md:hidden absolute top-full left-0 right-0 z-10 bg-primary text-white px-4 py-2">
          <div className="flex flex-col space-y-2">
            {isLoggedIn &&
              menuLinks.map((link) => (
                <NavLink
                  key={link.path}
                  title={link.title}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent font-semibold"
                      : "text-white hover:text-accent"
                  }
                >
                  {link.title}
                </NavLink>
              ))}

            {!isLoggedIn ? (
              <NavLink
                to="/login"
                title="로그인"
                onClick={handleLinkClick}
                className="mt-2 px-3 py-1 bg-white text-primary rounded w-max"
              >
                로그인
              </NavLink>
            ) : (
              <button
                onClick={() => {
                  handleLinkClick();
                  handleLogout();
                }}
                className="mt-2 px-3 py-1 bg-white text-primary rounded w-max"
                title="로그아웃"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
