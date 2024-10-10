const UnderConstructionHeader: React.FC = () => {
  return (
    <header className="fixed w-screen flex justify-center flex-col items-center">
      <div className="bg-amber-300 w-full h-1"></div>
      <div className="bg-amber-300 rounded-b-md pb-1 px-3 w-fit text-xs max-h-0 hover:max-h-96 text-amber-900 ease-in-out duration-300 transition-max-height overflow-hidden">
        🚧 this is a sandbox 🚧
      </div>
    </header>
  );
};

export default UnderConstructionHeader;
