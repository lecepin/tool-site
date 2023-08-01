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
  } catch (error) { }
}

export default function Qr() {
  const [key, setKey] = useState("Base64");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [outputImgValue, setOutputImgValue] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setKey(urlParams.get("s") || "Base64");
  }, []);

  useEffect(() => {
    function eventHandler(e: ClipboardEvent) {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();

          if (file) {
            handleImg2Base64File(file)
          }

          break;
        }
      }
    }

    if (key == "Base64img") { document.addEventListener("paste", eventHandler); }

    return () => {
      document.removeEventListener("paste", eventHandler);
    };
  }, [key]);

  const handleImg2Base64File = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const url = (event.target?.result as string) || '';
      setOutputImgValue(url)
      selectAll("." + styles.outputImg64);


      const imgEl = document.querySelector('.' + styles.outputImgPreview) as HTMLImageElement

      if (imgEl) {
        imgEl.src = url
        imgEl.style.display = 'block'
      }
    };

    reader.readAsDataURL(file);
  }

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
          }, {
            key: "Base64img",
            label: `图片 Base64`,
            children: (
              <div>
                <Upload.Dragger
                  className={styles.upload_list}
                  multiple={false}
                  maxCount={1}
                  accept="image/png, image/jpeg, image/gif, image/bmp"
                  beforeUpload={(e) => {
                    if (e) {
                      handleImg2Base64File(e)
                    }
                    return false;
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p>点击 或者 拖动图片到虚线框内 或者 Ctrl+V</p>
                </Upload.Dragger>
                <Input.TextArea
                  rows={4}
                  placeholder="Base64 编码或解码的结果"
                  className={styles.outputImg64}
                  value={outputImgValue}
                  onChange={(e) => {
                    setOutputImgValue(e.target.value);
                  }}
                ></Input.TextArea>

                <img className={styles.outputImgPreview} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
