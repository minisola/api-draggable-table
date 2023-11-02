import type { UniqueIdentifier } from "@dnd-kit/core";
import type { MutableRefObject } from "react";

export type ColumnType = {
  id: UniqueIdentifier;
  children?: ColumnType[];
  collapsed?: boolean;
  data?: Record<string, any>;
  [x: string]: any;
};

export type ApiEditableProps = {
  columns: ColumnType[];
};

export interface FlattenedItem extends ColumnType {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
