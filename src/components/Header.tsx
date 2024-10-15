const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 border-b w-full">
      <h1 className="text-xl font-bold">Title</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Run All Nodes
      </button>
    </header>
  );
};

export default Header;
