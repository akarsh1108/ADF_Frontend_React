import { useEffect, useState } from "react";
import { pusherClient } from "../lib/pusher";
import { termialLogs } from "../api/nodeApis";

const Terminal = () => {
  const [success, setSuccess] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [label, setLabel] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to the channel and event
    const channel = pusherClient.subscribe("logs-channel");
    channel.bind(
      "log-event",
      async function (data: {
        status: string;
        label?: string; // Make label optional
        message: string;
      }) {
        setLogs((prevLogs) => [...prevLogs, data.message]);
        setSuccess((prevSuccess) => [...prevSuccess, data.status]);
        setLabel((prevLabel) => [
          ...prevLabel,
          data.label || "Connection Activity",
        ]);
        const req = {
          message: data.message,
          status: data.status,
          label: data.label || "Connection Activity",
        };
        const res = await termialLogs(req);
        console.log(res);
      }
    );

    // Cleanup on component unmount
    return () => {
      pusherClient.unsubscribe("logs-channel");
    };
  }, []);

  // Function to generate a color based on the label
  const getColorForLabel = (label: string) => {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `black`;
    return color;
  };

  return (
    <div className="h-1/4 bg-black text-white p-4 overflow-auto border-t">
      <p className="text-sm">Terminal</p>
      <div>
        {logs.map((log, index) => (
          <div key={index} className="flex items-center text-xs mb-1">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                success[index] === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                success[index] === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="mr-2">{new Date().toLocaleString()}</span>
            <span
              className="mr-2"
              style={{ color: getColorForLabel(label[index]) }}
            >
              ` {label[index]} `
            </span>
            <span>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
