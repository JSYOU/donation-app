"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getProducts, GetProductsParams, Product, Meta } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProductsListProps {
  params: Omit<GetProductsParams, "page" | "limit">;
}

export default function ProductsList({ params }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
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
      const response = await getProducts({
        ...params,
        page: reset ? 1 : page,
        limit: meta.limit || 10,
      });

      if (reset) {
        setProducts(response.data);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      }
      setMeta(response.meta);
    } catch (err) {
      console.error("Failed to load products:", err);
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
  }, [isLoading, page, meta]);

  if (isOverlayLoading) {
    return (
      <div className="relative min-h-[50vh]">
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 my-3 justify-items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((prod) => {
          const priceText =
            prod.priceMin === prod.priceMax
              ? `${prod.priceMin}`
              : `${prod.priceMin} - ${prod.priceMax}`;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-md overflow-hidden shadow flex flex-col"
            >
              <Image
                src={prod.imageUrl ?? "/fallback.png"}
                alt={prod.name}
                height={150}
                width={200}
                className="object-cover"
              />
              <div className="flex flex-col p-2 h-[130px] justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#000000E5] line-clamp-2">
                    {prod.name}
                  </div>
                  <div className="text-xs text-[#00000099] mt-1 line-clamp-1">
                    {prod.brandName}
                  </div>
                </div>
                <div className="text-red-600 font-semibold text-sm mt-1">
                  TWD {priceText}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={observerRef} className="h-8" />
      {isLoading && (
        <div className="text-center py-3">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
