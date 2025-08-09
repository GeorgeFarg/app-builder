import Image from "next/image";

const NavBar = () => {
  return (
    <div className='dark:bg-dark-main text-white h-[60px] w-full border-b-2 border-b-dark-light-300 px-[30px]'>
      <div className='flex justify-between items-center h-full'>
        <button className='flex px-[8px] py-[6px] dark:bg-dark-light-300 rounded-[10px]'>
          <Image width={30} height={30} src={"/logo.svg"} alt='logo' />
          <div className='w-[30pp] h-[30px] '></div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
