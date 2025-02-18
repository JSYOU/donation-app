"use client";

import Image from "next/image";

interface Donation {
  logo: string;
  name: string;
  description: string;
}

const DonationList = ({ donations }: { donations: Donation[] }) => {
  return (
    <div className="mx-4 my-3 space-y-[12px]">
      {donations.map(({ logo, name, description }, index) => (
        <div
          key={index}
          className="flex items-center p-[9px] bg-white rounded-md"
        >
          <Image src={logo} alt={name} width={64} height={64} />
          <div className="ml-3">
            <h2 className="font-[PingFang TC] font-medium text-[16px] leading-[24px] text-[#000000E5]">
              {name}
            </h2>
            <p className="mt-1 font-[PingFang TC] font-normal text-[13px] leading-[20px] text-[#000000B2]">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationList;
