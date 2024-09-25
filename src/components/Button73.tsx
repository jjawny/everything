import React from "react";

type Button73Props = {
  handleClick: () => void;
  isDisableHoverScale?: boolean;
  text?: string;
  children?: React.ReactNode;
};

const Button73 = React.forwardRef<HTMLButtonElement, Button73Props>((props, ref) => {
  // TODO: mui custom tooltip complained about not being able to pass a ref (console errors) now we let it, we don't need to assign the ref, but if we WANT that tool tip to hook into our component, we need to
  const { handleClick, isDisableHoverScale = false, text, children, ...rest } = props;

  return (
    <button
      ref={ref} // allow things like our <Tooltip> wrapper to work (must pass ref down)
      {...rest} // for <Tooltip> wrapper
      onClick={handleClick}
      className={`button-73 bg-white rounded-md border-none shadow-inner inline-block text-black text-xs font-sans font-medium cursor-pointer leading-none m-0 outline-none px-2 py-1 transition-all duration-150 ease-in-out hover:bg-yellow-400 hover:shadow-inner-orange-500 ${
        isDisableHoverScale ? "" : "hover:scale-105"
      }`}
      type="button"
      role="button"
    >
      {text ?? "PRESS ME PLEASE"}
      {children}
    </button>
  );
});

export default Button73;
