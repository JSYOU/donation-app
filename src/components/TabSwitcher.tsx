import React, { useRef, useEffect, useState } from "react";
import { CampaignType } from "@/utils/api";

interface TabSwitcherProps {
  activeTab: CampaignType;
  setActiveTab: (tab: CampaignType) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { type: CampaignType.CHARITY, label: "公益團體" },
    { type: CampaignType.PROJECT, label: "捐款專案" },
    { type: CampaignType.PRODUCT, label: "義賣商品" },
  ];
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (activeButtonRef.current) {
      const left = activeButtonRef.current.offsetLeft;
      const width = activeButtonRef.current.clientWidth;
      setUnderlineStyle({ left, width });
    }
  }, [activeTab]);

  return (
    <div className="relative border-b bg-white mb-[15px] pt-[15px] w-full">
      <div className="flex justify-evenly">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.type;
          return (
            <button
              ref={isActive ? activeButtonRef : null}
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`pb-3 text-center font-[PingFang TC] font-medium ${
                isActive
                  ? "text-[16px] leading-[20px] text-[#000000E5]"
                  : "text-[14px] leading-[19px] text-[#00000080]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <span
        className="absolute bottom-0 bg-[#D63F3C] transition-all duration-300 ease-out h-[3px] rounded-t-lg"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  );
};

export default TabSwitcher;
