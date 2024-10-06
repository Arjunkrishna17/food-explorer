import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./Graph.css";

import CustomNode from "./CustomNode";
import useService from "../../Hooks/useService";
import Sidebar from "../SideBar/Sidebar";
import Loader from "../Loader/Loader";

interface Category {
  idCategory: string;
  strCategory: string;
}

interface Node {
  id: string;
  data: {
    label: string;
    icon: string;
    type: string;
    nodeLevel: number;
    hasEdge: boolean;
  };
  type: string;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  data: { nodeLevel: number };
}

interface OptionNode {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const defaultGraph = {
  id: "1",
  data: {
    label: "Explore",
    icon: "explore",
    type: "explore",
    nodeLevel: 0,
    hasEdge: false,
  },
  type: "custom",
  position: { x: 300, y: 200 },
};

const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([defaultGraph]);
  const [selectedMealInfo, setSelectedMealInfo] = useState<any>();
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sideBar, setSideBar] = useState({ show: false, data: null });
  const [isLoading, setIsLoading] = useState(false);

  const {
    getCategories,
    getMealsByCategory,
    getMealDetails,
    getMealsByIngredient,
  } = useService();

  const updateEdgeVisibility = (nodeObj: Node, nodeList: Node[]) => {
    const indexOfData = nodeList.findIndex((node) => node.id === nodeObj.id);
    nodeObj.data.hasEdge = true;
    nodeList[indexOfData] = nodeObj;
    setNodes(nodeList);
  };

  const removeOpenedNodeInSameLevel = (nodeObj: Node) => {
    setSelectedMealInfo(undefined);

    //remove edge points in same level and nodes after the current node level.
    let newNOdes: Node[] = [];

    nodes.forEach((node) => {
      if (node.data.nodeLevel === nodeObj.data.nodeLevel) {
        node.data.hasEdge = false;
      }

      if (node.data.nodeLevel <= nodeObj.data.nodeLevel) {
        newNOdes.push(node);
      }
    });

    const newEdges = edges.filter(
      (edge) => edge.data.nodeLevel <= nodeObj.data.nodeLevel
    );

    setEdges(newEdges);
    setNodes(newNOdes);

    return newNOdes;
  };

  const getAllCategories = async (nodeObj: Node) => {
    setIsLoading(true);
    const result: Category[] = await getCategories();
    setIsLoading(false);

    if (!result) return;

    const categories = result.slice(0, 5);

    const categoryNodes = categories.map((category, index) =>
      createNode(
        category.strCategory,
        "restaurant",
        "category",
        nodeObj.data.nodeLevel + 1,
        nodeObj.position.x,
        nodeObj.position.y - 100 + index * 100
      )
    );

    const newEdges = categoryNodes.map((node) =>
      createEdge("1", node.id, node.data.nodeLevel)
    );

    setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
    setEdges([...newEdges]);
  };

  const addViewMeal = (nodeObj: Node) => {
    const node = createNode(
      "View Meals",
      "visibility",
      "viewMeal",
      nodeObj.data.nodeLevel + 1,
      nodeObj.position.x,
      nodeObj.position.y
    );

    const edge = createEdge(nodeObj.id, node.id, nodeObj.data.nodeLevel + 1);

    setNodes((oldNodes) => [...oldNodes, node]);
    setEdges((newEdges) => [...newEdges, edge]);
  };

  const getMeals = async (type: string, filter: string) => {
    let meals;

    if (type === "ingredient") {
      meals = await getMealsByIngredient(filter);
    } else {
      meals = await getMealsByCategory(filter);
    }

    return meals;
  };

  const addAllMealNodes = async (nodeObj: Node) => {
    const incomingEdge = edges.find((edge) => edge.target === nodeObj.id);
    const previousNode = nodes.find((n) => n.id === incomingEdge?.source);

    if (!previousNode) throw new Error("Node not found");

    setIsLoading(true);
    const result: OptionNode[] = await getMeals(
      previousNode.data.type,
      previousNode.data.label
    );
    setIsLoading(false);

    if (!result) return;

    const firstFiveMeals = result.slice(0, 5);

    const categoryNodes = firstFiveMeals.map((category, index) =>
      createNode(
        category.strMeal,
        "dinner_dining",
        "optionNode",
        nodeObj.data.nodeLevel + 1,
        nodeObj.position.x,
        nodeObj.position.y - 100 + index * 120
      )
    );

    const newEdges = categoryNodes.map((node) =>
      createEdge(nodeObj.id, node.id, nodeObj.data.nodeLevel)
    );

    setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
    setEdges((oldEdges) => [...oldEdges, ...newEdges]);
  };

  const addMealOptions = (nodeObj: Node) => {
    const mealOptions = [
      createNode(
        "View Ingredients",
        "visibility",
        "viewIngredients",
        nodeObj.data.nodeLevel + 1,
        nodeObj.position.x + 100,
        nodeObj.position.y - 100
      ),

      createNode(
        "View Tags",
        "visibility",
        "viewTags",
        nodeObj.data.nodeLevel + 1,
        nodeObj.position.x + 100,
        nodeObj.position.y
      ),

      createNode(
        "View Details",
        "visibility",
        "viewDetails",
        nodeObj.data.nodeLevel + 1,
        nodeObj.position.x + 100,
        nodeObj.position.y + 100
      ),
    ];

    const edges = mealOptions.map((eachNode) =>
      createEdge(nodeObj.id, eachNode.id, nodeObj.data.nodeLevel)
    );

    setNodes((oldNodes) => [...oldNodes, ...mealOptions]);
    setEdges((newEdges) => [...newEdges, ...edges]);
  };

  const getMealsDetailsFn = async (mealName: string) => {
    const mealInfo = await getMealDetails(mealName);
    setSelectedMealInfo(mealInfo);

    return mealInfo;
  };

  const getMealInfo = async (previousNode: Node) => {
    let mealInfo;
    setIsLoading(true);
    if (selectedMealInfo) {
      mealInfo = selectedMealInfo;
    } else {
      mealInfo = await getMealsDetailsFn(previousNode.data.label);
    }
    setIsLoading(false);

    return mealInfo;
  };

  const getIngredients = async (nodeObj: Node) => {
    const incomingEdge = edges.find((edge) => edge.target === nodeObj.id);
    const previousNode = nodes.find((n) => n.id === incomingEdge?.source);

    if (previousNode) {
      let mealInfo = await getMealInfo(previousNode);

      if (!mealInfo) return;

      const ingredients: Node[] = [];

      for (let i = 0; i < 5; i++) {
        const ingredient = mealInfo[`strIngredient${i}`];

        // Only add non-empty ingredients
        if (ingredient && ingredient.trim() !== "") {
          const node = createNode(
            ingredient,
            "category",
            "ingredient",
            nodeObj.data.nodeLevel + 1,
            nodeObj.position.x,
            nodeObj.position.y - 200 + i * 100
          );

          ingredients.push(node);
        }
      }

      const edges = ingredients.map((node) =>
        createEdge(nodeObj.id, node.id, nodeObj.data.nodeLevel)
      );

      setNodes((oldNodes) => [...oldNodes, ...ingredients]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const getTags = async (nodeObj: Node) => {
    const incomingEdge = edges.find((edge) => edge.target === nodeObj.id);
    const previousNode = nodes.find((n) => n.id === incomingEdge?.source);

    if (previousNode) {
      let mealInfo = await getMealInfo(previousNode);

      if (!mealInfo.strTags) return; //TODO show no tags in toast

      const tags: Node[] = [];

      for (let i = 0; i < 5; i++) {
        const allTags = mealInfo.strTags.split(",");

        const tag = allTags[i];

        if (!tag) {
          break;
        }

        const node = createNode(
          tag,
          "sell",
          "tag",
          nodeObj.data.nodeLevel + 1,
          nodeObj.position.x,
          nodeObj.position.y - 100 + i * 100
        );

        tags.push(node);
      }

      const edges = tags.map((node) =>
        createEdge(nodeObj.id, node.id, nodeObj.data.nodeLevel)
      );

      setNodes((oldNodes) => [...oldNodes, ...tags]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const viewDetails = async (nodeObj: Node) => {
    const incomingEdge = edges.find((edge) => edge.target === nodeObj.id);
    const previousNode = nodes.find((n) => n.id === incomingEdge?.source);

    if (previousNode) {
      let mealInfo = await getMealInfo(previousNode);

      if (!mealInfo.strTags) return;

      setSideBar({ show: true, data: mealInfo });
    }
  };

  const orchestratorFn = (node: Node) => {
    switch (node.data.type) {
      case "explore":
        getAllCategories(node);
        break;
      case "category":
        addViewMeal(node);
        break;
      case "viewMeal":
        addAllMealNodes(node);
        break;
      case "optionNode":
        addMealOptions(node);
        break;
      case "viewIngredients":
        getIngredients(node);
        break;
      case "viewTags":
        getTags(node);
        break;
      case "viewDetails":
        viewDetails(node);
        break;
      case "ingredient":
        addViewMeal(node);
        break;
      default:
        break;
    }
  };

  const onNodeClickHandler = (node: Node) => {
    //Initially update the edge point in custom node and remove any node greater than current clicked node
    const newNodeLIst = removeOpenedNodeInSameLevel(node);
    updateEdgeVisibility(node, newNodeLIst);

    orchestratorFn(node); //Call right function to create edge and node
  };

  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(event, node) => onNodeClickHandler(node)}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {sideBar.show && (
        <Sidebar
          data={sideBar.data}
          onClose={() => setSideBar({ show: false, data: null })}
        />
      )}

      {isLoading && <Loader />}
    </div>
  );
};

export default Graph;

const createNode = (
  label: string,
  icon: string,
  type: string,
  level: number,
  x: number,
  y: number
) => {
  return {
    id: uuidv4(),
    data: {
      label: label,
      icon: icon,
      type: type,
      nodeLevel: level + 1,
      hasEdge: false,
    },
    type: "custom",
    position: { x: x + 300, y: y },
  };
};

const createEdge = (source: string, target: string, nodeLevel: number) => {
  return {
    id: `e1-${uuidv4()}`,
    source: source,
    target: target,
    data: { nodeLevel: +1 },
  };
};
