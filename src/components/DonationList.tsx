"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getCampaigns, GetCampaignsParams, Campaign, Meta } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDebounce } from "@/hooks/useDebounce";
import NoData from "@/components/NoData";

interface DonationListProps {
  params: Omit<GetCampaignsParams, "page" | "limit">;
  limit?: number;
  disableInfiniteScroll?: boolean;
}

export default function DonationList({
  params,
  limit = 10,
  disableInfiniteScroll = false,
}: DonationListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit,
    totalItems: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);

  const observerRef = useRef<HTMLDivElement>(null);
  const debouncedParams = useDebounce(params, 500);

  useEffect(() => {
    setPage(1);
    setIsOverlayLoading(true);
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParams.type, debouncedParams.category, debouncedParams.keyword]);

  const loadData = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getCampaigns({
        ...debouncedParams,
        page: reset ? 1 : page,
        limit: meta.limit || 10,
      });

      if (reset) {
        setCampaigns(response.data);
        setPage(2);
      } else {
        setCampaigns((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      }
      setMeta(response.meta);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setIsLoading(false);
      setIsOverlayLoading(false);
    }
  };

  useEffect(() => {
    if (disableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && page <= meta.totalPages) {
          loadData();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableInfiniteScroll, isLoading, meta.totalPages, page]);

  if (isOverlayLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-4 my-3 space-y-[12px]">
      {params.keyword && campaigns.length === 0 ? (
        <NoData />
      ) : (
        campaigns.map((c) => (
          <div
            key={c.id}
            className="flex items-center p-[9px] bg-white rounded-md"
          >
            <Image
              src={c.logoUrl ?? "/fallback.png"}
              alt={c.name}
              width={64}
              height={64}
            />
            <div className="ml-3">
              <h2 className="font-[PingFang TC] font-medium text-[16px] leading-[24px] text-[#000000E5]">
                {c.name}
              </h2>
              <p className="mt-1 font-[PingFang TC] font-normal text-[13px] leading-[20px] text-[#000000B2]">
                {c.description}
              </p>
            </div>
          </div>
        ))
      )}
      {!disableInfiniteScroll && <div ref={observerRef} className="h-8" />}
      {isLoading && (
        <div className="text-center py-3 justify-items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
