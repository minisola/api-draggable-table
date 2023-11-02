import { RowDataType } from "../types/types";

export const flatColumns: (rowKey: string, columns: any) => RowDataType[] = (
  rowKey,
  columns
) => {
  const result: RowDataType[] = [];
  if (!columns) {
    return [];
  }
  loopArray(null, columns);
  function loopArray(parent: any, list: any) {
    for (let index = 0; index < list.length; index++) {
      const el = list[index];
      const parentKey = parent?.[rowKey];
      const parentKeys = [...(parent?.parentKeys || [])];
      if (parentKey !== void 0 && parentKeys) {
        parentKeys.push(parentKey);
      }
      const item = {
        ...el,
        parentKey,
        parentKeys,
        level: parentKeys.length,
      };
      result.push(item);
      if (item.children) {
        loopArray(item, item.children);
      }
    }
  }
  return result;
};
