"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getCampaigns, GetCampaignsParams, Campaign, Meta } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  useEffect(() => {
    loadData(true);
    setIsOverlayLoading(true);
  }, [params.type, params.category, params.keyword]);

  const loadData = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getCampaigns({
        ...params,
        ...meta,
        page: reset ? 1 : page,
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
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsOverlayLoading(false);
    }
  };

  useEffect(() => {
    if (disableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          meta &&
          page <= meta.totalPages
        ) {
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
  }, [disableInfiniteScroll, isLoading, meta, page]);

  if (isOverlayLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-4 my-3 space-y-[12px]">
      {campaigns.map((c) => (
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
      ))}
      {!disableInfiniteScroll && <div ref={observerRef} className="h-8" />}
      {isLoading && (
        <div className="text-center py-3 justify-items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
