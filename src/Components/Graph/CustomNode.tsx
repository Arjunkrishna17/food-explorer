import { Handle, Position } from "@xyflow/react";
import React from "react";

interface dataProps {
  data: {
    label: string;
    icon: string;
    type: string;
  };
}
const CustomNode = ({ data }: dataProps) => {
  return (
    <div
      className={
        "z-50 flex justify-left items-center space-x-2 bg-white border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer  " +
        (data.type === "optionNode" ? " w-72" : "w-40")
      }
    >
      <Handle
        type={data.label === "Explore" ? "source" : "target"}
        position={data.label === "Explore" ? Position.Right : Position.Left}
        style={{ background: "#555" }}
      />

      <span className="material-icons">{data.icon}</span>
      <p className="text-gray-600">{data.label}</p>

      <Handle
        type={"source"}
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default CustomNode;
