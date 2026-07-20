import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  School,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    branch: "",
    college: "",
  });

  const handleContinue = () => {
    if (!user.name.trim() || !user.branch.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full max-w-lg shadow-2xl"
      >

        {/* Logo */}

        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500 p-4 rounded-2xl">
            <BrainCircuit
              size={42}
              className="text-white"
            />
          </div>
        </div>

        {/* Heading */}

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome to ScholarOS
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Let's personalize your AI workspace.
        </p>

        {/* Name */}

        <label className="text-slate-300 block mb-2">
          Full Name <span className="text-red-400">*</span>
        </label>

        <div className="relative mb-6">

          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Enter your full name"
            value={user.name}
            onChange={(e) =>
              setUser({
                ...user,
                name: e.target.value,
              })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
          />

        </div>

        {/* Branch */}

        <label className="text-slate-300 block mb-2">
          Branch <span className="text-red-400">*</span>
        </label>

        <div className="relative mb-6">

          <GraduationCap
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="AIML / CSE / IT / E&TC"
            value={user.branch}
            onChange={(e) =>
              setUser({
                ...user,
                branch: e.target.value,
              })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
          />

        </div>

        {/* College */}

        <label className="text-slate-300 block mb-2">
          College <span className="text-slate-500">(Optional)</span>
        </label>

        <div className="relative mb-8">

          <School
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Enter your college name"
            value={user.college}
            onChange={(e) =>
              setUser({
                ...user,
                college: e.target.value,
              })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
          />

        </div>

        {/* Button */}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleContinue}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </motion.button>

      </motion.div>

    </div>
  );
}