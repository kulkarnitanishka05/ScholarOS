import GlobalSearch from "../components/GlobalSearch";
import NotificationMenu from "../components/NotificationMenu";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">

      <div className="flex items-center justify-between px-8 py-5">

        {/* Global Search */}
        <GlobalSearch />

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <NotificationMenu />

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">

            <UserCircle
              size={34}
              className="text-cyan-400"
            />

            <div>
              <p className="font-semibold text-white">
                {user?.name || "Guest"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.branch || "Student"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}