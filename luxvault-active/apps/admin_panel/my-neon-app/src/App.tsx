import { Account } from "./pages/account";
import { Auth } from "./pages/auth";
import { Home } from "./pages/home";

function pathname() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export default function App() {
  const path = pathname();

  if (path.startsWith("/auth")) {
    return <Auth />;
  }

  if (path.startsWith("/account")) {
    return <Account />;
  }

  return <Home />;
}
