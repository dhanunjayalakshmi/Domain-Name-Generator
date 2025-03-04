import { Wand2 } from "lucide-react";
import { useState } from "react";

const GeneratorForm = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    description: "",
    keywords: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Project Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Briefly describe your project (e.g., An AI tool for marketing analytics)"
          rows={4}
          className="relative w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left shadow-sm focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
          required
        />
        <p className="text-sm text-gray-500">
          Describe your project to help generate better domain names.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="keywords"
          className="block text-sm font-medium text-gray-700"
        >
          Keywords
        </label>
        <input
          type="text"
          id="keywords"
          value={formData.keywords}
          onChange={(e) =>
            setFormData({ ...formData, keywords: e.target.value })
          }
          placeholder="Enter keywords (e.g., tech, creative, digital)"
          className="relative w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left shadow-sm focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
          required
        />
        <p className="text-sm text-gray-500">
          Separate multiple keywords with commas
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors cursor-pointer"
      >
        <Wand2 className="w-5 h-5 mr-2" />
        Generate Names
      </button>
    </form>
  );
};

export default GeneratorForm;
