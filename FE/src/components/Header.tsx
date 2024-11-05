export default function Header() {
  return (
    <header className="w-full h-[60px] fixed top-0 left-0">
      <div className="max-w-[1280px] h-full mx-auto px-[88px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={"../public/Logo.png"} className={" h-[32px]"} />
          <h1 className="text-xl font-bold text-juga-grayscale-black">JuGa</h1>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-bold text-juga-grayscale-500">
            <button className="px-0.5 py-2">홈</button>
            <button className="px-0.5 py-2">랭킹</button>
            <button className="px-0.5 py-2">마이페이지</button>
          </nav>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-[280px] h-[36px] px-4 py-2 rounded-lg bg-juga-grayscale-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-juga-grayscale-500">
            로그인
          </button>
          <button className="px-4 py-2 text-sm text-white bg-juga-grayscale-black rounded-lg">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}
