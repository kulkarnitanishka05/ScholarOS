import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, FileText, MessageCircle, GitCompare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

      <div className="max-w-5xl text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="inline-flex bg-cyan-500 p-5 rounded-3xl mb-8">
            <BrainCircuit size={60} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          ScholarOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-slate-400 mb-12"
        >
          Your AI-Powered Research Workspace
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 mb-14">

          <Feature icon={<FileText />} text="Upload Research Papers" />
          <Feature icon={<MessageCircle />} text="Ask Questions with AI" />
          <Feature icon={<Sparkles />} text="Generate Smart Summaries" />
          <Feature icon={<GitCompare />} text="Compare Documents Instantly" />

        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/welcome")}
          className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-3 mx-auto"
        >
          Get Started
          <ArrowRight size={22} />
        </motion.button>

      </div>

    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
      <div className="text-cyan-400">
        {icon}
      </div>

      <span className="text-lg">
        {text}
      </span>
    </div>
  );
}
