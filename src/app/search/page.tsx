"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher, { SwitchType } from "@/components/TabSwitcher";
import SearchBar from "@/components/SearchBar";
import DonationList from "@/components/DonationList";
import SelectBar from "@/components/SelectBar";
import ProjectsList from "@/components/ProjectsList";
import ProductsList from "@/components/ProductsList";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab =
    (searchParams.get("tab") as SwitchType) || SwitchType.CHARITY;
  const initialCategory = searchParams.get("category") || "全部";
  const initialKeyword = searchParams.get("keyword") || "";

  const [activeTab, setActiveTab] = useState<SwitchType>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [isSearching, setIsSearching] = useState(false);
  const params = useMemo(
    () => ({
      type: activeTab,
      category: selectedCategory === "全部" ? "" : selectedCategory,
      keyword: searchTerm,
    }),
    [activeTab, selectedCategory, searchTerm]
  );

  useEffect(() => {
    const query = new URLSearchParams();

    if (activeTab !== SwitchType.CHARITY) {
      query.set("tab", activeTab);
    }
    if (selectedCategory !== "全部") {
      query.set("category", selectedCategory);
    }
    if (searchTerm) {
      query.set("keyword", searchTerm);
    }

    const search = query.toString();
    router.replace(`?${search}`);
  }, [activeTab, selectedCategory, searchTerm]);

  return (
    <>
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
        {activeTab === SwitchType.PRODUCT && <ProductsList params={params} />}
      </div>
    </>
  );
}
