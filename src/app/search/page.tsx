"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher from "@/components/TabSwitcher";
import SearchBar from "@/components/SearchBar";
import DonationList from "@/components/DonationList";
import SelectBar from "@/components/SelectBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  CampaignType,
  Campaign,
  getCampaigns,
  GetCampaignsParams,
} from "@/utils/api";

export default function Page() {
  const [activeTab, setActiveTab] = useState<CampaignType>(
    CampaignType.CHARITY
  );
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ totalPages: number } | null>(null);

  // 是否正在載入資料（含重新載入 & 載入更多）
  const [isLoading, setIsLoading] = useState(false);
  // 只在「重新載入」時顯示覆蓋層 Spinner
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);

  // 是否顯示搜尋欄
  const [isSearching, setIsSearching] = useState(false);

  // 載入資料的函式
  const loadCampaigns = async (reset = false) => {
    if (isLoading) return;

    setIsLoading(true);
    if (reset) setIsOverlayLoading(true);

    try {
      const params: GetCampaignsParams = {
        page: reset ? 1 : page,
        limit: 10,
        type: activeTab,
        category: selectedCategory === "全部" ? undefined : selectedCategory,
        keyword: debouncedSearchTerm || undefined,
      };

      const response = await getCampaigns(params);

      if (reset) {
        // 重新載入：覆蓋舊資料並把頁數重設為 2
        setCampaigns(response.data);
        setPage(2);
      } else {
        // 載入更多：把新資料接在舊資料後面
        setCampaigns((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      }
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    } finally {
      setIsLoading(false);
      if (reset) setIsOverlayLoading(false);
    }
  };

  // 監聽搜尋條件、Tab 或類別變化 -> 重新載入
  useEffect(() => {
    setPage(1);
    loadCampaigns(true);
  }, [activeTab, selectedCategory, debouncedSearchTerm]);

  // 無限滾動
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          meta &&
          page <= meta.totalPages
        ) {
          loadCampaigns();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isLoading, meta, page]);

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

        <div className="relative">
          {isOverlayLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {!isOverlayLoading && (
            <DonationList
              donations={campaigns.map((c) => ({
                name: c.name,
                description: c.description || "",
                logo: c.logoUrl || "/fallback.png",
              }))}
            />
          )}
        </div>

        <div ref={observerRef} />

        {isLoading && !isOverlayLoading && (
          <div className="text-center py-4">Loading...</div>
        )}
      </div>
    </>
  );
}
