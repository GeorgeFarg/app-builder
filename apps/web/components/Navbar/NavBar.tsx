import RippleButton from "@repo/ui/rippleButton";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

const NavBar = () => {
  return (
    <div className="dark:bg-dark-main text-white h-[50px] w-full border-b-2 border-b-dark-light-300 px-[30px]">
      <div className="flex justify-between items-center h-full">
        <RippleButton className="flex px-[8px] h-[38px] py-[6px] dark:bg-dark-light-300 rounded-[10px] cursor-pointer">
          <Image width={25} height={25} src={"/logo.svg"} alt="logo" />
          <div className="w-[25px] h-[25px] flex items-center justify-center">
            <FaChevronDown color="#7C7C7C" className="center" />
          </div>
        </RippleButton>

        <div className="h-full flex py-[8px] gap-1">
          <div className="dark:bg-dark-light-300 px-[12px] py-[10px] rounded-l-[8px]">
            <p className="text-[16px] relative centralize">Untitled</p>
          </div>
          <RippleButton className="px-3 py-2 items-center dark:bg-dark-light-300 rounded-r-[8px] cursor-pointer">
            <FaChevronDown
              color="#7C7C7C relative centralize"
              className="center"
            />
          </RippleButton>
        </div>

        {/* Account button section --- Yet to implement */}
        <div></div>
      </div>
    </div>
  );
};

export default NavBar;
