import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import { getDatabaseInfo } from "../services/api";

export default function Dashboard() {
  const [database, setDatabase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = async () => {
    try {
      const data = await getDatabaseInfo();
      setDatabase(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome to ScholarOS 🚀
        </p>
      </div>

      {loading ? (
        <h2 className="text-white text-2xl">
          Loading...
        </h2>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              title="Documents"
              value={database.total_documents}
            />

            <StatCard
              title="Chunks"
              value={database.total_chunks}
            />

            <StatCard
              title="Vectors"
              value={database.total_vectors}
              color="text-green-400"
            />

            <StatCard
              title="AI Model"
              value="Llama 3.3"
              color="text-yellow-400"
            />

          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-white mb-6">
              Indexed Documents
            </h2>

            {database.documents.length === 0 ? (
              <p className="text-gray-400">
                No documents indexed.
              </p>
            ) : (
              <ul className="space-y-3">

                {database.documents.map((doc, index) => (
                  <li
                    key={index}
                    className="bg-slate-800 rounded-lg p-4 text-cyan-400"
                  >
                    📄 {doc}
                  </li>
                ))}

              </ul>
            )}

          </div>
        </>
      )}
    </MainLayout>
  );
}