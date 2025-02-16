"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const categories = [
  "全部",
  "老人照護",
  "兒少照護",
  "動物保護",
  "身心障礙",
  "災難救助",
  "特殊疾病",
  "原住民族",
  "社區發展",
  "勸募救助",
  "教育扶助",
  "醫療救助",
  "弱勢兒少",
];

interface CategorySelectProps {
  showModal: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  showModal,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-90 transition-opacity duration-300 ease-out ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 z-99 transform transition-transform duration-300 ease-out ${
          showModal ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-center">選擇類別</h2>
          <button
            className="absolute top-0 right-0 text-gray-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className={`w-full px-3 py-2 rounded text-center transition-colors ${
                cat === selectedCategory
                  ? "text-red-600 bg-white border border-red-600"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySelect;
