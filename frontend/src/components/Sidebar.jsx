import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  UserCircle,
} from "lucide-react";

import navigation from "../data/navigation";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between">

      {/* Logo */}
      <div>

        <div className="flex items-center gap-3 px-6 py-8">

          <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
            <BrainCircuit size={28} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              ScholarOS
            </h1>

            <p className="text-sm text-slate-400">
              AI Research Assistant
            </p>
          </div>

        </div>

        {/* Navigation */}

        <nav className="px-4 mt-4 space-y-2">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300
                  ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={22} />
                    </motion.div>

                    <span className="font-medium">
                      {item.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-2 w-2 rounded-full bg-white"
                      />
                    )}
                  </>
                )}
              </NavLink>

            );

          })}

        </nav>

      </div>

      {/* Profile */}

      <div className="border-t border-slate-800 p-6">

        <div className="flex items-center gap-3">

          <div className="bg-slate-800 p-3 rounded-full">
            <UserCircle size={30} className="text-cyan-400" />
          </div>

          <div>
            <p className="text-white font-semibold">
              {user?.name || "Guest"}
            </p>

            <p className="text-sm text-slate-400">
              {user?.branch || "Student"}
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}