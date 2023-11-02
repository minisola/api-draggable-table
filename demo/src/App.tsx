import React from "react";
import ApiEditable from "../../dist/esm/index";
import "./App.css";

const columns = [
  {
    id: 1,
    children: [
      {
        id: 2,
      },
      {
        id: 3,
        children: [
          {
            id: 5,
          },
        ],
      },
    ],
  },
  { id: 4 },
];

const App: React.FC = () => <ApiEditable columns={columns} />;

export default App;
