import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-6xl font-bold text-cyan-400">
          ScholarOS
        </h1>

        <p className="text-gray-300 mt-5 text-xl">
          AI-Powered Research Assistant
        </p>

        <Link to="/dashboard">
          <button className="mt-10 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-semibold transition">
            Get Started
          </button>
        </Link>

      </div>

    </div>
  );
}