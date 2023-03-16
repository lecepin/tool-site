import Head from "next/head";
import dynamic from "next/dynamic";

import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";

import styles from "@/styles/Home.module.css";

const JsonViewer = dynamic(() => import("@/components/JsonViewer"), {
  ssr: false,
});
const Qr = dynamic(() => import("@/components/Qr"));
const Diff = dynamic(() => import("@/components/Diff"));

export default function Home() {
  const menuItems: MenuProps["items"] = [
    {
      key: "diff",
      label: "Diff 文本",
    },
    {
      key: "json",
      label: "JSON 查看",
    },
    {
      key: "qr",
      label: "生成/解析 二维码",
    },
    {
      key: "var-name",
      label: "生成变量名",
    },
  ];
  const [menuKey, setMenuKey] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setMenuKey(urlParams.get("k") || "diff");
  }, []);

  return (
    <>
      <Head>
        <title>Tool 工具站</title>
        <meta name="description" content="Tool 工具站" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Layout style={{ height: "100vh" }}>
          <Layout.Sider width={200} collapsible theme="light">
            <Menu
              mode="inline"
              selectedKeys={[menuKey]}
              defaultOpenKeys={[]}
              style={{ height: "100%" }}
              items={menuItems}
              onSelect={({ selectedKeys }) => {
                history.pushState("", "", "?k=" + selectedKeys[0]);
                setMenuKey(selectedKeys[0]);
              }}
            />
          </Layout.Sider>
          <Layout.Content
            style={{ padding: "1rem", minHeight: 280, overflow: "auto" }}
          >
            {menuKey === "diff" ? <Diff /> : null}
            {menuKey === "json" ? <JsonViewer /> : null}
            {menuKey === "qr" ? <Qr /> : null}
          </Layout.Content>
        </Layout>
      </main>
    </>
  );
}
