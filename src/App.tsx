import { ReactFlowProvider } from "reactflow";
import CustomFlow from "./flow/CustomFlow";

const App = () => {
  return (
    <div>
      <h1>Files1</h1>
      <h2>File1 List</h2>
      <h2>Files List</h2>

      <div style={{ width: "80vw", height: "80vh" }} className="App">
        <ReactFlowProvider>
          <CustomFlow />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default App;
