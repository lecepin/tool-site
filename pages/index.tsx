import Head from "next/head";
import dynamic from "next/dynamic";

import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { GithubOutlined } from "@ant-design/icons";
import { UAParser } from "ua-parser-js";

import styles from "@/styles/Home.module.css";

const JsonViewer = dynamic(() => import("@/components/JsonViewer"), {
  ssr: false,
});
const Qr = dynamic(() => import("@/components/Qr"));
const Diff = dynamic(() => import("@/components/Diff"));
const DirTree = dynamic(() => import("@/components/DirTree"));
const Encode = dynamic(() => import("@/components/Encode"));
const UA = dynamic(() => import("@/components/UA"));

export default function Home() {
  const menuItems: MenuProps["items"] = [
    {
      key: "diff",
      label: "Diff 文本",
      icon: <img src="/diff.svg" />,
    },
    {
      key: "json",
      label: "JSON 查看",
      icon: <img src="/json.svg" />,
    },
    {
      key: "qr",
      label: "生成/解析 二维码",
      icon: <img src="/qr.svg" />,
    },
    {
      key: "var-name",
      label: "生成变量名",
      icon: <img src="/var.svg" />,
    },
    {
      key: "dir-tree",
      label: "目录树",
      icon: <img src="/dir-tree.svg" />,
    },
    {
      key: "encode",
      label: "编码",
      icon: <img src="/encode.svg" />,
    },
    {
      key: "ua",
      label: "UA 解析",
      icon: <img src="/ua.svg" />,
    },
    {
      key: "pdf-m",
      label: "PDF 合并",
      icon: <img src="/pdf-m.svg" />,
    },
    {
      key: "svg-p",
      label: "SVG 压缩",
      icon: <img src="/svg-p.svg" />,
    },
    {
      key: "img-p",
      label: "图片 压缩",
      icon: <img src="/img-p.svg" />,
    },
    {
      key: "github",
      label: "Github",
      icon: <GithubOutlined />,
    },
  ];
  const [menuKey, setMenuKey] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setMenuKey(urlParams.get("k") || "diff");
  }, []);

  useEffect(() => {
    setCollapsed(
      ["android", "ios"].includes(
        (UAParser(navigator.userAgent).os.name || "").toLowerCase()
      )
    );
  }, []);

  return (
    <>
      <Head>
        <title>Tool 工具站</title>
        <meta name="description" content="Tool 工具站" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `    (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "kpun0mundg");`,
          }}
        />
        ;
      </Head>
      <main className={styles.main}>
        <Layout style={{ height: "100vh" }}>
          <Layout.Sider
            width={200}
            collapsible
            theme="light"
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className={styles.menu}
          >
            <Menu
              mode="inline"
              selectedKeys={[menuKey]}
              defaultOpenKeys={[]}
              style={{ height: "100%" }}
              items={menuItems}
              onSelect={({ selectedKeys }: { selectedKeys: string[] }) => {
                if (selectedKeys[0] === "github") {
                  window.open("https://github.com/lecepin");
                  return;
                }

                history.pushState("", "", "?k=" + selectedKeys[0]);
                setMenuKey(selectedKeys[0]);
              }}
            />
          </Layout.Sider>
          <Layout.Content
            style={{ padding: "1rem", minHeight: 280, overflow: "auto" }}
          >
            {menuKey === "diff" && <Diff />}
            {menuKey === "json" && <JsonViewer />}
            {menuKey === "qr" && <Qr />}
            {menuKey === "dir-tree" && <DirTree />}
            {menuKey === "encode" && <Encode />}
            {menuKey === "pdf-m" && (
              <iframe
                src="https://lecepin.github.io/OfflinePDFCombiner/"
                style={{
                  width: "100%",
                  height: "99%",
                  border: 0,
                }}
              ></iframe>
            )}
            {menuKey === "svg-p" && (
              <iframe
                src="https://jakearchibald.github.io/svgomg/"
                style={{
                  width: "100%",
                  height: "99%",
                  border: 0,
                }}
              ></iframe>
            )}
            {menuKey === "img-p" && (
              <iframe
                src="https://squoosh.app/"
                style={{
                  width: "100%",
                  height: "99%",
                  border: 0,
                }}
              ></iframe>
            )}
            {menuKey === "var-name" && (
              <iframe
                src="https://fanyi.timymy.com/"
                style={{
                  width: "100%",
                  height: "99%",
                  border: 0,
                }}
              ></iframe>
            )}
            {menuKey === "ua" && <UA />}
          </Layout.Content>
        </Layout>
      </main>
    </>
  );
}
