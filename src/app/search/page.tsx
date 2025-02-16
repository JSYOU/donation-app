"use client";

import Head from "next/head";
import { useState } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher from "@/components/TabSwitcher";
import SearchBar from "@/components/SearchBar";
import DonationList from "@/components/DonationList";
import SelectBar from "@/components/SelectBar";
import { useDebounce } from "@/hooks/useDebounce";

const donations = [
  {
    name: "ACC 中華者幼關懷協會",
    description: "你身上有光，能照亮不確定的黑暗",
    logo: "/logo1.png",
    category: "兒少照護",
    type: "公益團體",
  },
  {
    name: "ASGL 台灣雲後光聯盟",
    description: "陰天不代表藍天不見了...",
    logo: "/logo2.png",
    category: "身心障礙",
    type: "公益團體",
  },
  {
    name: "NCF羅慧夫顏面基金會",
    description: "提供病患心理建設服務",
    logo: "/logo3.png",
    category: "身心障礙",
    type: "捐款專案",
  },
  {
    name: "TFCF 台灣兒童暨家庭扶助基金會",
    description: "讓孩子們有更好的未來",
    logo: "/logo4.png",
    category: "兒少照護",
    type: "義賣商品",
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("公益團體");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // mock search
  const filteredDonations = donations.filter((item) => {
    const matchTab = item.type === activeTab;
    const matchCategory =
      selectedCategory === "全部" || item.category === selectedCategory;
    const matchSearch =
      !debouncedSearchTerm ||
      item.name.includes(debouncedSearchTerm) ||
      item.description.includes(debouncedSearchTerm);

    return matchTab && matchCategory && matchSearch;
  });

  return (
    <>
      <Head>
        <title>所有捐款項目</title>
      </Head>
      <HeaderBar title="所有捐款項目" />

      <div className="pt-[54px]">
        {isSearching && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onCancel={() => setIsSearching(false)}
          />
        )}

        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        {!isSearching && (
          <SelectBar
            onSearchClick={() => setIsSearching(true)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <DonationList donations={filteredDonations} />
      </div>
    </>
  );
}
