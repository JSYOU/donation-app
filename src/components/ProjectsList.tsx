"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getProjects, GetProjectsParams, Project, Meta } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDebounce } from "@/hooks/useDebounce";
import NoData from "@/components/NoData";

interface ProjectsListProps {
  params: Omit<GetProjectsParams, "page" | "limit">;
  limit?: number;
  disableInfiniteScroll?: boolean;
}

export default function ProjectsList({
  params,
  limit = 10,
  disableInfiniteScroll = false,
}: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);

  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit,
    totalItems: 0,
    totalPages: 0,
  });

  const observerRef = useRef<HTMLDivElement>(null);
  const debouncedParams = useDebounce(params, 500);

  useEffect(() => {
    setPage(1);
    setIsOverlayLoading(true);
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedParams.category,
    debouncedParams.keyword,
    debouncedParams.status,
  ]);

  const loadData = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getProjects({
        ...debouncedParams,
        page: reset ? 1 : page,
        limit: meta.limit || 10,
      });

      if (reset) {
        setProjects(response.data);
        setPage(2);
      } else {
        setProjects((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      }
      setMeta(response.meta);
    } catch (err) {
      console.error("Failed to load projects:", err);
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
    <div className="mx-4 my-3 space-y-3 justify-items-center">
      {params.keyword && projects.length === 0 ? (
        <NoData />
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-md overflow-hidden shadow w-fit"
          >
            <Image
              src={p.bannerUrl ?? "/fallback.png"}
              alt={p.name}
              width={640}
              height={320}
              className="object-cover"
            />
            <div className="p-3">
              <div className="text-sm text-red-600 font-medium">{p.name}</div>
              <div className="mt-1 text-base text-black font-semibold leading-snug">
                {p.description}
              </div>
              {Array.isArray(p.category) && p.category.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      {!disableInfiniteScroll && <div ref={observerRef} className="h-8" />}
      {isLoading && (
        <div className="text-center py-3">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
