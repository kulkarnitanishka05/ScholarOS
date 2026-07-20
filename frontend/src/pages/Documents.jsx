import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDocuments } from "../services/api";

export default function Documents() {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        📚 Indexed Documents
      </h1>

      {loading ? (

        <p className="text-white text-xl">
          Loading...
        </p>

      ) : (

        <>
          {documents.length === 0 ? (

            <div className="bg-slate-900 rounded-xl p-8 text-center">

              <h2 className="text-2xl text-white">
                No Documents Found
              </h2>

            </div>

          ) : (

            <div className="space-y-5">

              {documents.map((doc, index) => (

                <div
                  key={index}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-cyan-500 transition"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="text-xl font-bold text-cyan-400">
                        📄 {doc}
                      </h2>

                      <p className="text-gray-400 mt-2">
                        Status : Indexed
                      </p>

                    </div>

                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg">
                      Ready
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

          <div className="mt-10 bg-slate-900 rounded-xl p-6">

            <h2 className="text-2xl text-white font-bold">
              Total Documents : {documents.length}
            </h2>

          </div>

        </>

      )}

    </MainLayout>
  );
}
