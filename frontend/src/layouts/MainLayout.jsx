import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
