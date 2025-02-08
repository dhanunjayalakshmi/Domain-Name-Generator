import { Check, X } from "lucide-react";

const ResultsList = () => {
  return (
    <div className="mt-8">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full lg:min-w-max text-md text-left text-gray-500 dark:text-gray-400">
          <thead className="text-md text-white uppercase bg-purple-600 dark:bg-purple-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Domain
              </th>
              <th scope="col" className="px-6 py-3">
                .com
              </th>
              <th scope="col" className="px-6 py-3">
                .net
              </th>
              <th scope="col" className="px-6 py-3">
                .io
              </th>
              <th scope="col" className="px-6 py-3">
                .ai
              </th>
              <th scope="col" className="px-6 py-3">
                .tech
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5]?.map((num) => (
              <tr
                key={num}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-md text-gray-900 dark:text-white whitespace-nowrap">
                  Basename{num}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="text-green-600 flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    $12
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="text-red-600 flex items-center justify-center">
                    <X className="w-5 h-5 mr-2 text-red-500" />
                    Taken
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-center">
                  <div className="text-green-600 flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    $16
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="text-red-600 flex items-center justify-center">
                    <X className="w-5 h-5 mr-2 text-red-500" />
                    Taken
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="text-green-600 flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    $15
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsList;
