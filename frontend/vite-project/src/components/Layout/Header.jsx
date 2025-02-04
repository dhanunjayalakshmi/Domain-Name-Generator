import Logo from "./Logo";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
