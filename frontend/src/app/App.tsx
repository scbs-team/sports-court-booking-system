import { AppRoutes } from "./routes";
import NavBar from "../components/layout/NavBar";
import { useLocation } from "react-router-dom";
import { BookingProvider } from "../context/BookingContext";

const App = () => {
  const location = useLocation();
  const isAuth =
    location.pathname === "/" ||
    location.pathname === "/auth" ||
    location.pathname === "/about" ||
    location.pathname === "/topup" ||
    location.pathname === "/help";
  const hideNav = isAuth || location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <NavBar />}
      <main
        className={
          isAuth
            ? "flex flex-1 items-center justify-center px-4 py-12 sm:px-6"
            : hideNav
            ? "flex-1 px-0 py-0"
            : "flex-1 px-4 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-10"
        }
      >
        <div
          className={
            isAuth
              ? "w-full max-w-6xl"
              : hideNav
              ? "w-full"
              : "w-full"
          }
        >
          <div
            className={
              isAuth || hideNav
                ? ""
                : "surface-grid rounded-[32px] border border-slate-900/10 p-4 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)] sm:p-6"
            }
          >
            <BookingProvider>
              <AppRoutes />
            </BookingProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
