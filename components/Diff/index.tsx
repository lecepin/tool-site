import ReactDiffViewer from "react-diff-viewer";
import { Input, Button, message } from "antd";
import { useState } from "react";

function sortObjectKeys(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item));
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};

  for (const key of sortedKeys) {
    // @ts-ignore
    sortedObj[key] = sortObjectKeys(obj[key]);
  }

  return sortedObj;
}

export default function Diff() {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <Input.TextArea
          className="diff-old"
          placeholder="请输入旧内容"
          rows={10}
        ></Input.TextArea>
        <Input.TextArea
          className="diff-new"
          placeholder="请输入新内容"
        ></Input.TextArea>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <Button
          type="dashed"
          style={{ width: 150 }}
          onClick={() => {
            const _old = (
              document.querySelector(".diff-old") as HTMLTextAreaElement
            ).value;
            const _new = (
              document.querySelector(".diff-new") as HTMLTextAreaElement
            ).value;

            try {
              const __old = sortObjectKeys(JSON.parse(_old));
              const __new = sortObjectKeys(JSON.parse(_new));

              (
                document.querySelector(".diff-old") as HTMLTextAreaElement
              ).value = JSON.stringify(__old, null, 2);
              (
                document.querySelector(".diff-new") as HTMLTextAreaElement
              ).value = JSON.stringify(__new, null, 2);
            } catch (error) {
              messageApi.error("JSON 格式错误");
            }
          }}
        >
          JSON Sort
        </Button>
        <Button
          type="primary"
          style={{ width: 150 }}
          onClick={() => {
            const _old = (
              document.querySelector(".diff-old") as HTMLTextAreaElement
            ).value;
            const _new = (
              document.querySelector(".diff-new") as HTMLTextAreaElement
            ).value;

            if (_old === _new) {
              messageApi.info("两者内容相等");
            } else {
              setOldCode(_old);
              setNewCode(_new);
            }
          }}
        >
          Start Diff
        </Button>
        <Button
          style={{ width: 150 }}
          onClick={() => {
            setOldCode("");
            setNewCode("");

            setTimeout(() => {
              (
                document.querySelector(".diff-old") as HTMLTextAreaElement
              ).value = "";
              (
                document.querySelector(".diff-new") as HTMLTextAreaElement
              ).value = "";
            });
          }}
        >
          Clear
        </Button>
      </div>
      {oldCode && newCode ? (
        <div style={{ overflow: "auto", fontSize: 12 }}>
          <ReactDiffViewer
            oldValue={oldCode}
            newValue={newCode}
            splitView={true}
          />
        </div>
      ) : null}
    </div>
  );
}
