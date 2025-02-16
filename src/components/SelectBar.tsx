"use client";

import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CategorySelect from "./CategorySelect";

interface SelectBarProps {
  onSearchClick: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

function SelectBar({
  onSearchClick,
  selectedCategory,
  onSelectCategory,
}: SelectBarProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between m-[15px]">
        <button
          className="
            px-3 py-2
            rounded
            font-[PingFang TC]
            font-medium
            text-[14px]
            leading-[22px]
            tracking-[0]
            text-[#000000B2]
            bg-[#EDEDF1]
            flex
            items-center
          "
          onClick={() => setShowModal(true)}
        >
          {selectedCategory}
          <span className="ml-1 text-[12px] text-[#9FA0AB]">▼</span>
        </button>

        <button
          className="p-2 bg-[#EDEDF1] rounded-full"
          onClick={onSearchClick}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <CategorySelect
        showModal={showModal}
        onClose={() => setShowModal(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default SelectBar;
