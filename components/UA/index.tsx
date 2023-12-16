import { Input, Button } from "antd";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import styled from "styled-components";

const MacWindow = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin: 20px auto;

  .window-header {
    background: #ebebeb;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
  }
  .window-title {
    flex-grow: 1;
    text-align: center;
  }
  .window-content {
    padding: 16px;
  }
  .traffic-lights {
    display: flex;
    align-items: center;
  }
  .traffic-light {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 4px;
  }
  .traffic-light.close {
    background: #ff5f57;
  }
  .traffic-light.minimize {
    background: #ffbd2e;
  }
  .traffic-light.maximize {
    background: #27c93f;
  }
  .key {
    color: red;
  }
  .string {
    color: green;
  }
  .number {
    color: blue;
  }
  .boolean {
    color: firebrick;
  }
  .null {
    color: magenta;
  }
  pre {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    padding: 10px;
    overflow: auto;
    white-space: pre-wrap; /* CSS property for automatic word wrapping */
    word-wrap: break-word;
    line-height: 1.5;
  }
`;

const DivTop = styled.div`
  display: flex;

  & > :first-child {
    margin-right: 10px;
  }
`;

function syntaxHighlight(json: string) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

export default function Diff() {
  const [ua, setUA] = useState(navigator.userAgent);
  const [uaResult, setUaResult] = useState("");

  useEffect(() => {
    setUaResult(syntaxHighlight(JSON.stringify(UAParser(ua), null, 2)));
  }, []);

  return (
    <div>
      <DivTop>
        <Button
          size="large"
          onClick={() => {
            setUaResult(syntaxHighlight(JSON.stringify(UAParser(ua), null, 2)));
          }}
          type="primary"
        >
          解析
        </Button>
        <Input
          size="large"
          value={ua}
          onChange={(e) => setUA(e.target.value)}
        />
      </DivTop>

      <MacWindow>
        <div className="window-header">
          <div className="traffic-lights">
            <div className="traffic-light close"></div>
            <div className="traffic-light minimize"></div>
            <div className="traffic-light maximize"></div>
          </div>
          <div className="window-title">UA 解析结果</div>
        </div>
        <div className="window-content">
          <pre dangerouslySetInnerHTML={{ __html: uaResult }}></pre>
        </div>
      </MacWindow>
    </div>
  );
}
