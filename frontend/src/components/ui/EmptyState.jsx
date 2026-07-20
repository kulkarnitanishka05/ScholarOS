import { FileX } from "lucide-react";

export default function EmptyState({
  title,
  description,
}) {
  return (
    <div className="text-center py-16">

      <FileX
        size={64}
        className="mx-auto text-slate-500"
      />

      <h2 className="text-2xl font-semibold mt-6 text-white">
        {title}
      </h2>

      <p className="text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}
