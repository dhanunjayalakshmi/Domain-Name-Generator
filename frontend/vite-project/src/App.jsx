import Layout from "./components/Layout/Layout";
import GeneratorForm from "./components/Generator/GeneratorForm";
import ResultsList from "./components/Generator/ResultsList";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = "An unexpected error occurred";
    if (error.response) {
      if (error.response.status === 429) {
        customMessage =
          "You have reached the maximum number of requests allowed per hour. Please try again later.";
      } else {
        customMessage = error.response.data.message || customMessage;
      }
    } else {
      customMessage = "Network error or no response from server";
    }
    error.customMessage = customMessage;
    return Promise.reject(error);
  }
);

const checkAvailability = async (domains, updateError) => {
  try {
    const response = await axiosInstance.post("/check-availability", {
      domains,
    });
    return response?.data?.availability;
  } catch (error) {
    updateError(error.customMessage);
    return null;
  }
};

const generateNames = async (description, keywords, updateError) => {
  try {
    const response = await axiosInstance.post("/generate-names", {
      description,
      keywords,
    });
    return response?.data?.names;
  } catch (error) {
    updateError(error.customMessage);
    return null;
  }
};

export default function App() {
  const [availability, setAvailability] = useState([] | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);

    const description = formData?.description;
    const keywords = formData?.keywords.split(",").map((kw) => kw.trim());

    const domains = await generateNames(description, keywords, setError);

    const availabilityResponse = await checkAvailability(domains, setError);

    setAvailability(availabilityResponse);
    setLoading(false);
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
          ) : availability ? (
            <ResultsList availability={availability} />
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
