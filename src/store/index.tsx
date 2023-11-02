import { createContext, useState } from "react";
import { ColumnType, FlattenedItem } from "../types/types";

export type StoreStateType = {
  columnData: ColumnType[];
  flattenedData: FlattenedItem[];
};

const initialState: StoreStateType = {
  columnData: [],
  flattenedData: [],
};

export const StoreContext = createContext<StoreStateType>(initialState);
export const SetStoreContext = createContext<
  React.Dispatch<React.SetStateAction<StoreStateType>>
>(() => {});

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [store, setStore] = useState<StoreStateType>(initialState);
  return (
    <StoreContext.Provider value={store}>
      <SetStoreContext.Provider value={setStore}>
        {props.children}
      </SetStoreContext.Provider>
    </StoreContext.Provider>
  );
};
