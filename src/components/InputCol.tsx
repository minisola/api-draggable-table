import { FC, useRef, useState } from "react";
import { CaretRightOutlined, HolderOutlined } from "@ant-design/icons";
import { RowDataType } from "../types";

export type InputColType<T = RowDataType> = {
  dragHandle?: boolean;
  showCollapsed?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  value?: T;
  dragProps?: {
    listeners: any;
    setActivatorNodeRef: any;
  };
};

export const InputCol: FC<InputColType> = (props) => {
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { dragHandle, showCollapsed = false,value } = props;

  const onChangeInputValueEvent = () => {
    const text = inputRef.current?.innerText;
    if (text !== null && text !== "") {
      setPlaceholder("");
      setInputValue(text || "");
    } else {
      setPlaceholder(null);
      setInputValue("");
    }
  };

  const onFocus = () => {
    const delayTime = placeholder === null ? 50 : 100;
    timeoutRef.current = setTimeout(() => {
      onChangeInputValueEvent();
      onFocus();
    }, delayTime);
  };

  const onBlur = () => {
    onChangeInputValueEvent();
    window.clearTimeout(timeoutRef.current);
  };

  return (
    <>
      <div className="aet-api-col__input">
        {dragHandle ? (
          <div
            className="aet-draggable__handle"
            ref={props.dragProps!.setActivatorNodeRef}
            // onPointerDown={(e)=>{
            //   console.log('e: ', e);
            // }}
            {...props.dragProps!.listeners}
          >
            <HolderOutlined />
          </div>
        ) : null}

        {showCollapsed ? (
          <div
            className="aet-api-col__input-collapse"
            onClick={() => {
              props.onCollapseChange?.(true);
            }}
          >
            <CaretRightOutlined />
          </div>
        ) : null}

        <div
          className="aet-api-col__input-content-wrapper"
        >
          <div
            className="aet-api-col__input-content"
            contentEditable
            ref={inputRef}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            {/* {value?.id} */}
          </div>
          <div className="aet-api-col__input-placeholder">
            {placeholder === null ? "字段名" : placeholder}
          </div>
        </div>
      </div>
    </>
  );
};
