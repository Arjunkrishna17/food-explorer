import { Handle, Position } from "@xyflow/react";
import React from "react";

interface dataProps {
  data: {
    label: string;
    icon: string;
    type: string;
    hasEdge: boolean;
  };
}
const CustomNode = ({ data }: dataProps) => {
  return (
    <div
      className={
        "z-50 flex justify-left items-center hover:bg-gray-200 space-x-2 bg-white border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer  " +
        (data.type === "optionNode" ? " w-72" : "w-44")
      }
    >
      {data.label !== "Explore" && (
        <Handle
          type={data.label === "Explore" ? "source" : "target"}
          position={Position.Left}
          style={{ background: "#555" }}
        />
      )}

      <span className="material-icons">{data.icon}</span>
      <p className="text-gray-600">{data.label}</p>

      {data?.hasEdge && (
        <Handle
          type={"source"}
          position={Position.Right}
          style={{ background: "#555" }}
        />
      )}
    </div>
  );
};

export default CustomNode;
