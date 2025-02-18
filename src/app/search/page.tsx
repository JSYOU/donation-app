"use client";

import Head from "next/head";
import { useState, useMemo } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher, { SwitchType } from "@/components/TabSwitcher";
import SearchBar from "@/components/SearchBar";
import DonationList from "@/components/DonationList";
import SelectBar from "@/components/SelectBar";
import ProjectsList from "@/components/ProjectsList";

export default function Page() {
  const [activeTab, setActiveTab] = useState<SwitchType>(SwitchType.CHARITY);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const params = useMemo(
    () => ({
      type: activeTab,
      category: selectedCategory === "全部" ? "" : selectedCategory,
      keyword: searchTerm,
    }),
    [activeTab, selectedCategory, searchTerm]
  );

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

        {activeTab === SwitchType.CHARITY && <DonationList params={params} />}
        {activeTab === SwitchType.PROJECT && <ProjectsList params={params} />}
        {activeTab === SwitchType.PRODUCT && <DonationList params={params} />}
      </div>
    </>
  );
}
