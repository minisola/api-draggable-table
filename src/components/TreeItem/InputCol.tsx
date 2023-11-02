import {
  FC,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CaretDownFilled, HolderOutlined } from "@ant-design/icons";
import { ColumnType, FlattenedItem } from "../../types/types";
import { SetStoreContext, StoreContext } from "../../store";
import { useMemoizedFn } from "ahooks";
import { buildTree, flattenTree } from "../../utils";
import classNames from "classnames";

export type InputColType<T = ColumnType> = {
  showCollapsed?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  inputKey?: string;
  value?: T;
  handleProps?: any;
};

export const InputCol: FC<InputColType> = (props) => {
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const setCtx = useContext(SetStoreContext);
  const { flattenedData, columnData } = useContext(StoreContext);

  const { handleProps, value, inputKey = "name", collapsed } = props;

  useLayoutEffect(() => {
    const keyValue = value?.data?.[inputKey];
    if (keyValue !== void 0 && keyValue !== inputRef.current?.innerText) {
      setPlaceholder("");
      inputRef.current!.innerText = keyValue;
    }
  }, [value]);

  useEffect(() => {
    const observer = new MutationObserver(([dom]) =>
      onChangeInputValueEvent(dom)
    );
    observer.observe(inputRef.current!, { characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const onChangeInputValueEvent = (dom: MutationRecord) => {
    const text = dom.target.nodeValue;
    if (text !== null && text !== "") {
      setPlaceholder("");
    }
    triggerChange(text || "");
  };

  const triggerChange = useMemoizedFn((text: string) => {
    const cloneData: FlattenedItem[] = JSON.parse(
      JSON.stringify(flattenedData)
    );
    const prev = cloneData.find((i) => i.id === value?.id)!;
    const prevText = prev?.data?.[inputKey];
    if (prevText === text) {
      return;
    } else {
      if (!prev.data) {
        prev.data = {};
      }
      prev.data[inputKey] = text;
    }
    setCtx((prev) => ({
      ...prev,
      columnData: buildTree(cloneData),
    }));
  });

  const onCollapseChange = () => {
    const cloneData: FlattenedItem[] = JSON.parse(
      JSON.stringify(flattenTree(columnData))
    );
    const prev = cloneData.find((i) => i.id === value?.id)!;
    prev.collapsed = !prev.collapsed;
    setCtx((prev) => ({
      ...prev,
      columnData: buildTree(cloneData),
    }));
  };

  return (
    <>
      <div className="aet-api-col__input">
        <div className="aet-draggable__handle" {...handleProps}>
          <HolderOutlined />
        </div>

        {value?.children?.length ? (
          <div
            className={classNames(
              "aet-api-col__input-collapse",
              collapsed && "aet-api-col__input-collapse--collapsed"
            )}
            onClick={onCollapseChange}
          >
            <CaretDownFilled />
          </div>
        ) : null}

        <div className="aet-api-col__input-content-wrapper">
          <div
            className="aet-api-col__input-content"
            suppressContentEditableWarning
            contentEditable
            ref={inputRef}
          ></div>
          <div className="aet-api-col__input-placeholder">
            {placeholder === null ? "字段名" : placeholder}
          </div>
        </div>
      </div>
    </>
  );
};
