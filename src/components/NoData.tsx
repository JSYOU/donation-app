"use client";

import Image from "next/image";

export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Image
        src="/no-data.png"
        alt="No Data"
        width={144}
        height={144}
        className="mb-4"
      />

      <p className="text-[20px] font-medium leading-[28px] text-[#000000E5]">
        查無相關資料
      </p>

      <p className="text-[14px] font-normal leading-[22px] text-[#00000080] mt-2">
        請調整關鍵字再重新搜尋
      </p>
    </div>
  );
}
