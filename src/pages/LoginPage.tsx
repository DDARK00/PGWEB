import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    // TODO: 로그인 API 호출
    setErrorMessage("");
    console.log("로그인 시도:", email);
  };

  const hasError = Boolean(errorMessage);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-light">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            PW
          </div>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          로그인
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError}
              className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={hasError}
              className="mt-1 block w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="text-warning text-center mb-4"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            로그인
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link to="" className="text-accent hover:underline">
              회원가입
            </Link>
            <Link to="" className="text-primary hover:underline">
              비밀번호 재설정
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
