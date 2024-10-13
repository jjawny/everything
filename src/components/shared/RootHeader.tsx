import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";

const RootHeader: React.FC = () => {
  return (
    <header className="z-50 fixed select-none top-0 left-0 w-screen flex h-[80px] justify-between">
      <div
        className="bg-amber-300 content-center self-start bg-under-construction font-sedgwick p-1 pr-20 w-fit text-xs hover:opacity-100 opacity-50 transition-all ease-in-out duration-500 h-full text-amber-900"
        style={{ background: "linear-gradient(to right, rgba(255, 193, 7, 1) 40%, rgba(255, 193, 7, 0) 100%)" }}
      >
        <InfoIcon fontSize="small" color="disabled" className="mr-1" /> this is a sandbox!!!
      </div>
      <div className="h-full flex">
        <Image
          src="/images/graffiti-splat.png"
          alt="graffiti splat"
          layout="fill"
          objectFit="contain"
          className="h-full !static !w-auto" // FIXME: hacky fix to override styles, issue is a blank flash before goes to the correct position, if it cannot be fixed in Next Image just use raw <img>
        />
        <div className="opacity-100 bg-black px-10 flex bg-b items-center justify-around h-full gap-2 pb-2">
          <Image src="/images/eye.png" alt="eye icon to represent page with visual features" width={20} height={20} />
          <Image
            src="/images/form.png"
            alt="form icon to represent page with form features"
            width={20}
            height={20}
            className="filter invert"
          />
        </div>
      </div>
    </header>
  );
};

export default RootHeader;
