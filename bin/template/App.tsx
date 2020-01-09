import React from "react";
import "./App.css";
import { Row, Button } from "antd";


const App: React.FC = () => {
  return (
    <div className="App">
      <Row type="flex" justify="center">
        <div>
          <Button type="primary">开始</Button>
        </div>
      </Row>
    </div>
  );
};

export default App;
