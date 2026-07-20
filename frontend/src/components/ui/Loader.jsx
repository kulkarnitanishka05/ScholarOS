import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-10">

      <LoaderCircle
        className="animate-spin text-cyan-400"
        size={36}
      />

    </div>
  );
}
