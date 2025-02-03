import { Layout } from "./components/Layout/Layout";
import { GeneratorForm } from "./components/Generator/GeneratorForm";

export function App() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <GeneratorForm />
        </div>
      </div>
    </Layout>
  );
}
