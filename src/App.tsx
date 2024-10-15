import { ReactFlowProvider } from "reactflow";
import CustomFlow from "./flow/CustomFlow";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Terminal from "./components/Terminal";
import { useEffect } from "react";
import Pusher from "pusher-js";

const App = () => {
  useEffect(() => {
    var pusher = new Pusher("aeeb90d987e5e72bddbe", {
      cluster: "ap2",
    });
    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data: any) {
      alert(JSON.stringify(data));
    });
  });
  return (
    <div className="relative w-screen h-screen">
      {/* Header goes on top with fixed height */}
      <Header />
      <div className="absolute top-16 left-0 right-0 bottom-16 grid grid-cols-5 gap-0">
        {/* Sidebar with fixed width */}
        <Sidebar />

        {/* React Flow takes the remaining space */}
        <div className="col-span-4 p-4 overflow-auto">
          <ReactFlowProvider>
            <CustomFlow />
          </ReactFlowProvider>
        </div>
      </div>

      {/* Terminal goes at the bottom with fixed height */}
      <Terminal />
    </div>
  );
};

export default App;
