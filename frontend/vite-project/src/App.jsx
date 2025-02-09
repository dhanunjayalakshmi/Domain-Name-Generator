import Layout from "./components/Layout/Layout";
import GeneratorForm from "./components/Generator/GeneratorForm";
import ResultsList from "./components/Generator/ResultsList";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const checkAvailability = async (domains) => {
  const response = await axiosInstance.post("/check-availability", { domains });
  return response?.data?.availability;
};

const generateNames = async (description, keywords) => {
  const response = await axiosInstance.post("/generate-names", {
    description,
    keywords,
  });
  return response?.data?.names;
};

export default function App() {
  const [availability, setAvailability] = useState([] | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const description = formData?.description;
      const keywords = formData?.keywords.split(",").map((kw) => kw.trim());

      const domains = await generateNames(description, keywords);

      const availabilityResponse = await checkAvailability(domains);

      setAvailability(availabilityResponse);
    } catch (error) {
      console.error("Error in generating and checking domains:", error);
      setError(
        "An error occurred while generating domain suggestions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <GeneratorForm onGenerate={handleGenerate} />
          {error && <div className="text-red-500 mt-4">{error}</div>}
          {loading ? (
            <div className="flex flex-col justify-center items-center mt-8">
              <ClipLoader size={50} color={"#4A90E2"} />
              <p className="mt-4 text-blue-500">Generating suggestions...</p>
            </div>
          ) : error ? (
            <p className="text-red-600 mt-4">{error}</p>
          ) : availability ? (
            <ResultsList availability={availability} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
