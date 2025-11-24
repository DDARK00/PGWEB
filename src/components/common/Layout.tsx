import Nav from "./Nav";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen flex flex-col">
      {/* 상단 nav */}
      <Nav />

      {/* 페이지 콘텐츠 */}
      <main className="grow flex justify-center items-center px-4">
        <Outlet />
      </main>

      {/* 하단 footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 PGWEB. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
