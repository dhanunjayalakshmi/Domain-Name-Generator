import Header from "./Header";
import Hero from "./Hero";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-12 -mt-8">{children}</main>
    </div>
  );
};

export default Layout;
