type Button73Props = {
  handleClickCallback: () => void;
  isActive?: boolean;
};

const Button73: React.FC<Button73Props> = (props) => {
  const { isActive = false } = props;

  return (
    <button
      className={`button-73 bg-white rounded-md border-none shadow-inner inline-block text-black text-xs font-sans font-medium cursor-pointer leading-none m-0 outline-none px-2 py-1 transition-all duration-150 ease-in-out hover:bg-yellow-400 hover:shadow-inner-orange-500 hover:scale-105 ${
        isActive ? "bg-yellow-400 -inner-orange-500 scale-105" : ""
      }`}
      type="button"
      role="button"
    >
      PRESS ME PLEASE
    </button>
  );
};

export default Button73;
