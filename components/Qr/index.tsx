import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Tabs, Input, Button } from "antd";
import { useEffect, useState } from "react";
import JsQr from "jsqr";
import QRCode from "qrcode";
// QRCode.toDataURL('I am a pony!')
//   .then(url => {
//     console.log(url)
//   })
//   .catch(err => {
//     console.error(err)
//   })
import styles from "./index.module.css";

export default function Qr() {
  const [key, setKey] = useState("generate");
  const [qrImg, setQrImg] = useState("");

  function fileToUint8ArrayAndSize(
    file: File,
    callback: (data: Uint8ClampedArray, width: number, height: number) => void
  ) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        const imageData = ctx!.getImageData(0, 0, img.width, img.height);
        const uint8Array = new Uint8ClampedArray(imageData.data.buffer);

        callback(uint8Array, img.width, img.height);
      };
      img.src = event.target!.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleGetFile(file: File) {
    fileToUint8ArrayAndSize(file, (data, width, height) => {
      const code = JsQr(data, width, height);

      const el = document.querySelector(
        "." + styles.decode_result
      ) as HTMLTextAreaElement;

      el.value = code?.data || "";

      if (code) {
        message.success("解析成功");
      } else {
        message.error("解析失败");
      }
    });
  }
  useEffect(() => {
    function eventHandler(e: ClipboardEvent) {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();

          file && handleGetFile(file);

          break;
        }
      }
    }

    key == "parse" && document.addEventListener("paste", eventHandler);

    return () => {
      document.removeEventListener("paste", eventHandler);
    };
  }, [key]);

  return (
    <div>
      <Tabs
        onChange={(e) => {
          setKey(e);
        }}
        activeKey={key}
        items={[
          {
            key: "generate",
            label: `生成`,
            children: (
              <div>
                <Input.TextArea
                  rows={4}
                  placeholder="请填写内容"
                  style={{ marginTop: 16 }}
                  onChange={(e) => {
                    QRCode.toDataURL(e.target.value, { margin: 1, width: 200 })
                      .then((url) => {
                        setQrImg(url);
                      })
                      .catch((err) => {
                        setQrImg("");
                      });
                  }}
                ></Input.TextArea>
                {qrImg ? (
                  <div style={{ textAlign: "center", margin: 16 }}>
                    <img src={qrImg} />
                    <div style={{ margin: 16 }}></div>
                    <Button
                      onClick={() => {
                        const link = document.createElement("a");

                        link.download = Date.now() + ".png";
                        link.href = qrImg;
                        link.click();
                        link.remove();
                      }}
                    >
                      下载二维码
                    </Button>
                  </div>
                ) : null}
              </div>
            ),
          },
          {
            key: "parse",
            label: `解析`,
            children: (
              <div>
                <Upload.Dragger
                  className={styles.upload_list}
                  multiple={false}
                  maxCount={1}
                  accept="image/png, image/jpeg, image/gif, image/bmp"
                  beforeUpload={(e) => {
                    e && handleGetFile(e);
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
                  className={styles.decode_result}
                  placeholder="解析结果"
                  style={{ marginTop: 16 }}
                ></Input.TextArea>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
