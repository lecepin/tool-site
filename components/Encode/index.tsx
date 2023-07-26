import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Tabs, Input, Button } from "antd";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

import styles from "./index.module.css";

function selectAll(className: string, t = 0) {
  const el = document.querySelector(className) as HTMLInputElement;

  try {
    setTimeout(() => {
      el.select();
      el.focus();
    }, t);
  } catch (error) {}
}

export default function Qr() {
  const [key, setKey] = useState("Base64");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  return (
    <div>
      <Tabs
        onChange={(e) => {
          setKey(e);
        }}
        activeKey={key}
        items={[
          {
            key: "Base64",
            label: `Base64`,
            children: (
              <div>
                <Input.TextArea
                  rows={4}
                  className={styles.input}
                  placeholder="请输入要进行 Base64 编码或解码的字符"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                ></Input.TextArea>
                <div className={styles.div1}>
                  <Button
                    type="primary"
                    className={styles.btn1}
                    onClick={() => {
                      setOutputValue(
                        CryptoJS.enc.Base64.stringify(
                          CryptoJS.enc.Utf8.parse(inputValue)
                        )
                      );

                      selectAll("." + styles.output);
                    }}
                  >
                    编码（Encode）
                  </Button>

                  <Button
                    onClick={() => {
                      try {
                        setOutputValue(
                          CryptoJS.enc.Utf8.stringify(
                            CryptoJS.enc.Base64.parse(inputValue)
                          )
                        );

                        selectAll("." + styles.output);
                      } catch (error) {
                        message.error("解码错误，请填入正确编码文本");
                      }
                    }}
                  >
                    解码（Decode）
                  </Button>
                </div>
                <Input.TextArea
                  rows={4}
                  placeholder="Base64 编码或解码的结果"
                  className={styles.output}
                  value={outputValue}
                  onChange={(e) => {
                    setOutputValue(e.target.value);
                  }}
                ></Input.TextArea>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
