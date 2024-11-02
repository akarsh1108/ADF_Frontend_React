import { ReactFlowProvider } from "reactflow";
import CustomFlow from "./flow/CustomFlow";
import Header from "./components/Header";
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
    <div className="relative w-screen h-screen bg-slate-600">
      {/* Header takes 10% of the height */}
      <div className="h-[8%] w-[100%] flex justify-center align-middle bg-slate-600">
        <Header />
      </div>
      <div className="absolute top-[8%] h-[65%] left-0 right-[30%] bottom-0 grid grid-cols-5 gap-0 bg-black">
        {/* React Flow takes the remaining space */}
        <div className="col-span-5 p-4 overflow-auto h-[65%] bg-slate-600">
          <ReactFlowProvider>
            <CustomFlow />
          </ReactFlowProvider>
        </div>
      </div>
      {/* Terminal takes 30% of the width */}
      <div className="absolute top-[8%] right-0 bottom-0 h-[30%] bg-black">
        <Terminal />
      </div>
    </div>
  );
};

export default App;
