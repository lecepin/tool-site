import React, { ChangeEvent, MouseEvent } from "react";
import { Select } from "antd";
import ReactJson from "lp-rjv";
import parseJson from "jsonic";

class App extends React.Component<
  {},
  {
    data: Object;
    rjvKey: number;
    collapsed: boolean | number;
  }
> {
  refEdit: HTMLDivElement | null;
  isDragStart: boolean;
  dragStartX: number;
  dragStartWidth: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: {},
      rjvKey: Date.now(),
      collapsed: false,
    };

    this.refEdit = null;
    this.isDragStart = false;
    this.dragStartX = 0;
    this.dragStartWidth = 0;
  }

  handleTextAreaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    e.persist();

    try {
      const json = parseJson(e.target.value);

      this.setState({
        data: json,
        rjvKey: Date.now(),
      });
    } catch (error) {
      this.setState({
        data: {},
      });
    }
  }

  // 视图配置
  handleStatusChange(e: string) {
    let value: boolean | number = false;

    if (e == "true") {
      value = true;
    } else if (e == "false") {
    } else {
      value = +e;
    }

    this.setState({ collapsed: value, rjvKey: Date.now() });
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.isDragStart) {
      return;
    }
    let _width = this.dragStartWidth + (e.clientX - this.dragStartX);

    if (_width > (document.body.offsetWidth / 3) * 2) {
      return;
    }
    _width = _width < 50 ? 0 : _width;

    this.refEdit!.style.width = _width + "px";

    if (_width == 0) {
      this.refEdit!.style.display = "none";
    } else {
      this.refEdit!.style.display = "block";
    }
  }

  handleMouseDown(e: MouseEvent) {
    this.dragStartX = e.clientX;
    this.dragStartWidth = this.refEdit!.clientWidth;
    this.isDragStart = true;
  }

  handleMouseUp(e: MouseEvent) {
    this.isDragStart = false;
  }

  render() {
    const { data, rjvKey, collapsed } = this.state;

    return (
      <div
        className="tool-lp-json-view-App"
        onMouseMove={(e) => this.handleMouseMove(e)}
        onMouseUp={(e) => this.handleMouseUp(e)}
      >
        <div className="tool-lp-json-view-App-view">
          <div className="tool-lp-json-view-App-parse-box">
            <div
              className="tool-lp-json-view-App-parse-box-edit"
              ref={(_) => (this.refEdit = _)}
            >
              <textarea
                className="tool-lp-json-view-App-parse-box-textarea"
                onChange={(e) => this.handleTextAreaChange(e)}
              ></textarea>
            </div>
            <div
              className="tool-lp-json-view-App-parse-box-drag"
              onMouseDown={(e) => this.handleMouseDown(e)}
            >
              <img src="/dragSvg.svg" />
            </div>
            <div className="tool-lp-json-view-App-parse-box-view">
              <div className="tool-lp-json-view-App-status">
                展开状态：
                <Select
                  defaultValue="false"
                  style={{ width: 120 }}
                  onChange={(e) => this.handleStatusChange(e)}
                  options={[
                    { value: "false", label: "全部展开" },
                    { value: "true", label: "全部折叠" },
                    { value: "1", label: "展开1层" },
                    { value: "2", label: "展开2层" },
                    { value: "3", label: "展开3层" },
                  ]}
                />
              </div>

              <ReactJson
                key={rjvKey}
                name={null}
                src={data || {}}
                iconStyle="square"
                indentWidth={2}
                displayDataTypes={false}
                collapsed={collapsed}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
