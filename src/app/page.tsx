import Head from "next/head";
import HeaderBar from "@/components/HeaderBar";
export default function Page() {
  return (
    <>
      <Head>
        <title>公益捐款</title>
      </Head>
      <HeaderBar title="公益捐款" />

      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold text-center">公益捐款</h1>
      </div>
    </>
  );
}
