"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getProjects, GetProjectsParams, Project, Meta } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProjectsListProps {
  params: Omit<GetProjectsParams, "page" | "limit">;
}

export default function ProjectsList({ params }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);

  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
    setIsOverlayLoading(true);
    loadData(true);
  }, [params.category, params.keyword, params.status]);

  const loadData = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getProjects({
        ...params,
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
  }, [isLoading, meta, page]);

  if (isOverlayLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-4 my-3 space-y-3 justify-items-center">
      {projects.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-md overflow-hidden shadow w-fit"
        >
          <div className="">
            <Image
              src={p.bannerUrl ?? "/fallback.png"}
              alt={p.name}
              width={640}
              height={320}
              className="object-cover"
            />
          </div>
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
      ))}
      <div ref={observerRef} className="h-8" />
      {isLoading && (
        <div className="text-center py-3">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
