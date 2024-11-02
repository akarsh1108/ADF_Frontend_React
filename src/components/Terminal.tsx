import { useEffect, useState, useRef } from "react";
import { pusherClient } from "../lib/pusher";
import { termialLogs } from "../api/nodeApis";

const Terminal = () => {
  const [success, setSuccess] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [label, setLabel] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  //   {
  //     "label": "Jupyter Notebook Activity",
  //     "message": "Error encountered during execution",
  //     "last_successful_cell": {
  //         "success": true,
  //         "cell_position": 1,
  //         "output": "ggggggggggutttttt\n"
  //     },
  //     "error_details": {
  //         "type": "TypeError",
  //         "message": "unsupported operand type(s) for /: 'str' and 'int'",
  //         "traceback": "Traceback (most recent call last):\n  File \"C:\\Users\\APRIYADARS1\\OneDrive - Rockwell Automation, Inc\\Desktop\\Project\\ADF_Backend\\main.py\", line 259, in run_code_cell\n    exec(code)\n  File \"<string>\", line 6, in <module>\nTypeError: unsupported operand type(s) for /: 'str' and 'int'\n"
  //     }
  // }

  useEffect(() => {
    const channel = pusherClient.subscribe("logs-channel");
    channel.bind(
      "log-event",
      async function (data: {
        status: string;
        label?: string;
        message: string;
        detail?: any;
      }) {
        setLogs((prevLogs) => [
          ...prevLogs,
          data.detail
            ? `${data.message} ${data.detail.message} ${data.detail.traceback}`
            : data.message,
        ]);
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

    return () => {
      pusherClient.unsubscribe("logs-channel");
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getColorForLabel = (label: string) => {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  return (
    <div
      className="terminal-container h-16 p-4 overflow-auto"
      ref={terminalRef}
    >
      <p className="text-sm text-white mb-2">Terminal</p>
      <div className="log-entries">
        {logs.map((log, index) => (
          <div key={index} className="log-entry flex items-center text-xs mb-1">
            <span
              className={`status-indicator mr-2 ${
                success[index] === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="log-time mr-2">{new Date().toLocaleString()}</span>
            <span
              className="log-label mr-2"
              style={{ color: getColorForLabel(label[index]) }}
            >
              {label[index]}
            </span>
            <span className="log-message">{log}</span>
          </div>
        ))}
      </div>
      <style>{`
        .terminal-container {
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 15px rgba(224, 183, 255, 0.2);
          color: white;
          font-family: "Courier New", Courier, monospace;
          transition: transform 0.3s ease-in-out;
          height: 280px; /* Fixed height */
          overflow-y: auto; /* Scrollable */
        }

        // .terminal-container:hover {
        //   transform: scale(1.05);
        // }

        .log-entry {
          display: flex;
          align-items: center;
          padding: 6px;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .status-indicator {
          width: 10px;
          height: 10px;
        }

        .log-label {
          font-weight: bold;
        }

        .log-message {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default Terminal;
