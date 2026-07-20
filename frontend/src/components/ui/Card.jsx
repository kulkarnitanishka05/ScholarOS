import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        shadow-lg
        p-6
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
