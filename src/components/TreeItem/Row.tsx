import { InputCol } from "./InputCol";
import { ColumnType } from "../../types/types";
import { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

import styles from "./TreeItem.module.scss";

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: ColumnType;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLDivElement): void;
}

export const TreeRow = forwardRef<HTMLDivElement, Props>(
  (
    {
      clone,
      depth,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          styles.Wrapper,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableInteraction && styles.disableInteraction
        )}
        ref={wrapperRef}
        {...props}
      >
        <div
          className="aet-api-row"
          style={{
            paddingLeft: clone ? 0 : indentationWidth,
          }}
        >
          <div
            className="aet-api-row__prefix"
            style={{
              minWidth: `${indentationWidth * depth}px`,
            }}
          ></div>
          <div
            className={classNames("aet-api-row__body", styles.TreeItem)}
            ref={ref}
            style={style}
          >
            <div className="aet-api-col aet-api-col-name">
              <InputCol
                collapsed={collapsed}
                handleProps={handleProps}
                value={value}
                inputKey="name"
              ></InputCol>
            </div>
            <div className="aet-api-col aet-api-col-type">object</div>
            <div className="aet-api-col aet-api-col-mock">
              <div className="aet-api-col__input">
                <div className="aet-api-col__input-content"></div>
                <div className="aet-api-col__input-placeholder">Mock</div>
              </div>
            </div>
            <div className="aet-api-col aet-api-col-description">
              <div className="aet-api-col__input">
                <div className="aet-api-col__input-content"></div>
                <div className="aet-api-col__input-placeholder">说明</div>
              </div>
            </div>
            <div className="aet-api-col aet-api-col-footer">
              <button>新增</button>
              <button>删除</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
