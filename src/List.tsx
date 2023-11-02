import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  buildTree,
  flattenTree,
  getProjection,
  removeItem,
  removeChildrenOf,
  setProperty,
} from "./utils";
import type { ColumnType, FlattenedItem, SensorContext } from "./types/types";
import { SortableTreeItem } from "./components";
import { SetStoreContext, StoreContext } from "./store";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

interface Props {
  collapsible?: boolean;
  columns?: ColumnType[];
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

const List = ({
  collapsible,
  columns = [],
  indicator = false,
  indentationWidth = 20,
  removable,
}: Props) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const setCtx = useContext(SetStoreContext);
  const { flattenedData, columnData } = useContext(StoreContext);

  useLayoutEffect(() => {
    setCtx((prev) => ({
      ...prev,
      columnData: columns,
    }));
  }, [columns]);

  useLayoutEffect(() => {
    const flattenedTree = flattenTree(columnData);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children?.length ? [...acc, id] : acc,
      []
    );

    const result = removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
    setCtx((prev) => ({
      ...prev,
      flattenedData: result,
    }));
  }, [activeId, columnData]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedData,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;

  const sensorContext: SensorContext = useRef({
    items: flattenedData,
    offset: offsetLeft,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const sortedIds = useMemo(
    () => flattenedData.map(({ id }) => id),
    [flattenedData]
  );

  const activeItem = activeId
    ? flattenedData.find(({ id }) => id === activeId)
    : null;

  const flattenedItemGroup = activeItem ? flattenTree([activeItem]) : [];

  useEffect(() => {
    sensorContext.current = {
      items: flattenedData,
      offset: offsetLeft,
    };
  }, [flattenedData, offsetLeft]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedData.map((item) => (
          <SortableTreeItem
            key={item.id}
            id={item.id}
            value={item}
            depth={
              item.id === activeId && projected ? projected.depth : item.depth
            }
            indentationWidth={indentationWidth}
            indicator={indicator}
            collapsed={Boolean(item.collapsed && item.children?.length)}
            onCollapse={
              collapsible && item.children?.length
                ? () => handleCollapse(item.id)
                : undefined
            }
            onRemove={removable ? () => handleRemove(item.id) : undefined}
          />
        ))}
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeItem
              ? flattenedItemGroup.map((item) => (
                  <SortableTreeItem
                    key={item.id}
                    id={item.id}
                    value={item}
                    depth={item.depth}
                    clone
                    indentationWidth={indentationWidth}
                    collapsed={Boolean(item.collapsed && item.children?.length)}
                  />
                ))
              : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);
    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(columnData))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setCtx((prev) => ({
        ...prev,
        columnData: newItems,
      }));
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    document.body.style.setProperty("cursor", "");
  }

  function handleRemove(id: UniqueIdentifier) {
    setCtx((prev) => ({
      ...prev,
      columnData: removeItem(prev.columnData, id),
    }));
  }

  function handleCollapse(id: UniqueIdentifier) {
    setCtx((prev) => ({
      ...prev,
      columnData: setProperty(prev.columnData, id, "collapsed", (value) => {
        return !value;
      }),
    }));
  }
};

export default List;
