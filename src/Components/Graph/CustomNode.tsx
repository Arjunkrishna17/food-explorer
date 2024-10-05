import { Handle, Position } from "@xyflow/react";

interface dataProps {
  data: {
    label: string;
    icon: string;
    type: string;
    hasEdge: boolean;
  };
}

const colorDecider = (type: string) => {
  let color = "";

  switch (type) {
    case "explore":
      color = "bg-gray-500";
      break;
    case "category":
      color = "bg-red-500";
      break;
    case "viewMeal":
      color = "bg-green-500";
      break;
    case "optionNode":
      color = "bg-blue-500";
      break;
    case "viewIngredients":
      color = "bg-green-500";
      break;
    case "viewTags":
      color = "bg-green-500";
      break;
    case "viewDetails":
      color = "bg-green-500";
      break;
    default:
      color = "bg-blue-500";
      break;
  }

  return color;
};
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

      <span
        className={"material-icons text-white p-1 " + colorDecider(data.type)}
      >
        {data.icon}
      </span>
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
