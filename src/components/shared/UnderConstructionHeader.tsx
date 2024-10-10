const UnderConstructionHeader: React.FC = () => {
  return (
    <header className="z-50 fixed select-none top-0 left-0 font-mono w-screen opacity-60 flex justify-center flex-col items-center">
      <div className="bg-amber-300 w-full h-1"></div>
      <div className="bg-amber-300 rounded-b-md pb-1 px-3 w-fit text-xs border-b-[1px] border-x-[1px] border-amber-200 text-amber-900">
        🚧 this is a sandbox 🚧
      </div>
    </header>
  );
};

export default UnderConstructionHeader;
