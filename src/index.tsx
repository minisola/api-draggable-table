import { FC } from "react";
import "./styles/style.scss";
import { StoreProvider } from "./store";
import List from "./List";
import { ApiEditableProps } from "./types/types";

const ApiEditable: FC<ApiEditableProps> = (props) => {
  return (
    <StoreProvider>
        <List indicator collapsible {...props} />
    </StoreProvider>
  );
};

export default ApiEditable;
