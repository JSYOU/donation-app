"use client";

import Head from "next/head";
import { useState } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher from "@/components/TabSwitcher";
import DonationList from "@/components/DonationList";

const donations = [
  {
    name: "ACC 中華者幼關懷協會",
    description: "你身上有光，能照亮不確定的黑暗",
    logo: "/logo1.png",
    category: "兒少照護",
    type: "公益團體",
  },
  {
    name: "ASGL 台灣雲後光聯盟",
    description: "陰天不代表藍天不見了...",
    logo: "/logo2.png",
    category: "身心障礙",
    type: "公益團體",
  },
  {
    name: "NCF羅慧夫顏面基金會",
    description: "提供病患心理建設服務",
    logo: "/logo3.png",
    category: "身心障礙",
    type: "捐款專案",
  },
  {
    name: "TFCF 台灣兒童暨家庭扶助基金會",
    description: "讓孩子們有更好的未來",
    logo: "/logo4.png",
    category: "兒少照護",
    type: "義賣商品",
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("公益團體");

  return (
    <>
      <Head>
        <title>所有捐款項目</title>
      </Head>
      <HeaderBar title="所有捐款項目" />

      <div className="pt-[54px]">
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        <DonationList donations={donations} />
      </div>
    </>
  );
}
