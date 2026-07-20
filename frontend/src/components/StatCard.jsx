export default function StatCard({
  title,
  value,
  color = "text-cyan-400",
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800 hover:border-cyan-500 transition">

      <h3 className="text-gray-400 text-lg">
        {title}
      </h3>

      <p className={`text-4xl font-bold mt-4 ${color}`}>
        {value}
      </p>

    </div>
  );
}