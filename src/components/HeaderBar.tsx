"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const HeaderBar = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 z-[99] flex items-center justify-center bg-[#C9191D] px-4 py-4 shadow-md">
      <button
        onClick={() => router.back()}
        className="absolute left-4 text-white"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <h1
        className="
          font-[SF Pro Text]
          font-bold
          text-white
          text-center
          text-[17px]
          leading-[22px]
          [letter-spacing:-0.41px]
        "
      >
        {title}
      </h1>
    </header>
  );
};

export default HeaderBar;
