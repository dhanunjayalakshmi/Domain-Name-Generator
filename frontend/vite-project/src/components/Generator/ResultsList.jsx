import { Check, X } from "lucide-react";

const ResultsList = ({ availability }) => {
  const extensions = Object.keys(
    availability[Object.keys(availability)[0]] || []
  );

  return (
    <div className="mt-8">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full mx-auto lg:min-w-max text-md text-left rounded-lg text-gray-500 dark:text-gray-400">
          <thead className="text-md text-white uppercase bg-purple-600 dark:bg-purple-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Domain
              </th>
              {extensions?.map((extension) => (
                <th
                  key={extension}
                  scope="col"
                  className="px-6 py-3"
                >{`.${extension.toUpperCase()}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(availability).map((baseName) => (
              <tr
                key={baseName}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-md text-gray-900 dark:text-white whitespace-nowrap">
                  {baseName}
                </td>
                {extensions.map((extension) => (
                  <td key={extension} className="px-6 py-4 text-sm text-center">
                    {availability[baseName][extension] &&
                    availability[baseName][extension].available ? (
                      <div className="text-green-600 flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        {`${availability[baseName][extension].currency}${availability[baseName][extension].registrationPrice}`}
                      </div>
                    ) : (
                      <div className="text-red-600 flex items-center justify-center">
                        <X className="w-5 h-5 mr-2 text-red-500" />
                        Taken
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsList;
