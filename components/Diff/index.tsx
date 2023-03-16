import ReactDiffViewer from "react-diff-viewer";
import { Input, Button, message } from "antd";
import { useState } from "react";

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
