"use client";

import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import HeaderBar from "@/components/HeaderBar";
import DonationList from "@/components/DonationList";
import ProjectsList from "@/components/ProjectsList";

export default function HomePage() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handleViewMoreCharity = () => {
    router.push("/search?tab=CHARITY");
  };

  const handleViewMoreProject = () => {
    router.push("/search?tab=PROJECT");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar title="公益捐款" />

      <div className="bg-red-600 pt-[60px] pb-6 px-4 relative">
        <div
          onClick={handleSearchClick}
          className="mt-2 bg-[#FFFFFF1A] flex items-center px-3 py-2 rounded-full"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-white mr-3" />
          <span className="text-white opacity-70 text-sm">
            搜尋公益團體、捐款專案、義賣商品
          </span>
        </div>

        <div className="mt-4 flex space-x-3 overflow-x-auto pb-2">
          {FAKE_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="flex flex-col items-center min-w-[64px]"
            >
              <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center mb-1">
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-white text-xs">{cat.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="bg-gray-50 pt-2 px-4 pb-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-black text-base font-semibold">公益團體</h2>
            <button
              onClick={handleViewMoreCharity}
              className="text-blue-600 text-sm"
            >
              查看更多 &gt;
            </button>
          </div>
          <DonationList
            params={{ type: "CHARITY" }}
            limit={3}
            disableInfiniteScroll
          />

          <div className="flex items-center justify-between mt-6 mb-2">
            <h2 className="text-black text-base font-semibold">捐款專案</h2>
            <button
              onClick={handleViewMoreProject}
              className="text-blue-600 text-sm"
            >
              查看更多 &gt;
            </button>
          </div>
          <ProjectsList params={{}} limit={3} disableInfiniteScroll />
        </div>
      </div>
    </div>
  );
}

const FAKE_CATEGORIES = [
  { icon: "📖", title: "全部" },
  { icon: "🏀", title: "運動發展" },
  { icon: "🧩", title: "兒少照護" },
  { icon: "🐾", title: "動物保護" },
];
