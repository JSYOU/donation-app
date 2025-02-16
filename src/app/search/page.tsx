"use client";

import Head from "next/head";
import { useState } from "react";

import HeaderBar from "@/components/HeaderBar";
import TabSwitcher from "@/components/TabSwitcher";

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
      </div>
    </>
  );
}
