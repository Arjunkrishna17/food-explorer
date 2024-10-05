import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";

import CustomNode from "./CustomNode";
import useService from "../../Hooks/useService";
import "@xyflow/react/dist/style.css";
import "./Graph.css";
import Sidebar from "../SideBar/Sidebar";

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

const Graph = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
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
    },
  ]);
  const [selectedMealInfo, setSelectedMealInfo] = useState<any>();
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sideBar, setSideBar] = useState({ show: false, data: null });

  const {
    getCategories,
    getMealsByCategory,
    getMealDetails,
    getMealsByIngredient,
  } = useService();

  const updateNode = (nodeObj: Node, nodeList: Node[]) => {
    const indexOfData = nodeList.findIndex((node) => node.id === nodeObj.id);
    nodeObj.data.hasEdge = true;
    nodeList[indexOfData] = nodeObj;
    setNodes(nodeList);
  };

  const removeOpenedNodeInSameLevel = (nodeObj: Node) => {
    setSelectedMealInfo(undefined);

    const newNOdes = nodes.filter(
      (node) => node.data.nodeLevel <= nodeObj.data.nodeLevel
    );

    const newEdges = edges.filter(
      (edge) => edge.data.nodeLevel <= nodeObj.data.nodeLevel
    );

    setEdges(newEdges);
    setNodes(newNOdes);

    return newNOdes;
  };

  const getAllCategories = async (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const result: Category[] = await getCategories();
    const categories = result.slice(0, 5);

    const categoryNodes = categories.map((category, index) => ({
      id: uuidv4(),
      data: {
        label: category.strCategory,
        icon: "restaurant",
        type: "category",
        nodeLevel: nodeObj.data.nodeLevel + 1,
        hasEdge: false,
      },
      type: "custom",
      position: { x: 600, y: 50 + index * 100 }, // Adjusted positions
    }));

    const newEdges = categoryNodes.map((node) => ({
      id: `e1-${uuidv4()}`,
      source: "1", // Connect to "Explore" node
      target: node.id,
      data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
    }));

    // updateNode(nodeObj);
    setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
    setEdges([...newEdges]);
  };

  const addViewMeal = (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const node = {
      id: uuidv4(),
      data: {
        label: "View Meals",
        icon: "visibility",
        type: "viewMeal",
        hasEdge: false,
        nodeLevel: nodeObj.data.nodeLevel + 1,
      },
      type: "custom",
      position: { x: nodeObj.position.x + 300, y: nodeObj.position.y }, // Adjusted positions
    };

    const edge = {
      id: `e1-${uuidv4()}`,
      source: nodeObj.id, // Connect to "Explore" node
      target: node.id,
      data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
    };

    // updateNode(nodeObj);
    setNodes((oldNodes) => [...oldNodes, ...[node]]);
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

  const getOptionNode = async (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const incomingEdges = edges.filter((edge) => edge.target === nodeObj.id);

    const previousNodes = incomingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.source)
    );

    if (previousNodes[0]) {
      const result: OptionNode[] = await getMeals(
        previousNodes[0].data.type,
        previousNodes[0].data.label
      );
      const categories = result.slice(0, 5);

      const categoryNodes = categories.map((category, index) => ({
        id: uuidv4(),
        data: {
          label: category.strMeal,
          icon: "dinner_dining",
          type: "optionNode",
          nodeLevel: nodeObj.data.nodeLevel + 1,
          hasEdge: false,
        },
        type: "custom",
        position: {
          x: nodeObj.position.x + 400,
          y: nodeObj.position.y - 100 + index * 130,
        },
      }));

      const edges = categoryNodes.map((node) => ({
        id: `e1-${uuidv4()}`,
        source: nodeObj.id, // Connect to "Explore" node
        target: node.id,
        data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
      }));

      // updateNode(nodeObj);
      setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const addMealOptions = (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const mealOptions = [
      {
        id: uuidv4(),
        data: {
          label: "View Ingredients",
          icon: "visibility",
          type: "viewIngredients",
          nodeLevel: nodeObj.data.nodeLevel + 1,
          hasEdge: false,
        },
        type: "custom",
        position: { x: nodeObj.position.x + 400, y: nodeObj.position.y - 100 }, // Adjusted positions
      },
      {
        id: uuidv4(),
        data: {
          label: "View Tags",
          icon: "visibility",
          type: "viewTags",
          hasEdge: false,
          nodeLevel: nodeObj.data.nodeLevel + 1,
        },
        type: "custom",
        position: { x: nodeObj.position.x + 400, y: nodeObj.position.y + 50 }, // Adjusted positions
      },
      {
        id: uuidv4(),
        data: {
          label: "View Details",
          icon: "visibility",
          type: "viewDetails",
          hasEdge: false,
          nodeLevel: nodeObj.data.nodeLevel + 1,
        },
        type: "custom",

        position: { x: nodeObj.position.x + 400, y: nodeObj.position.y + 150 }, // Adjusted positions
      },
    ];

    const edges = mealOptions.map((eachNode) => ({
      id: `e1-${uuidv4()}`,
      source: nodeObj.id, // Connect to "Explore" node
      target: eachNode.id,
      data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
    }));

    // updateNode(node);
    setNodes((oldNodes) => [...oldNodes, ...mealOptions]);
    setEdges((newEdges) => [...newEdges, ...edges]);
  };

  const getMealsDetailsFn = async (mealName: string) => {
    const mealInfo = await getMealDetails(mealName);
    setSelectedMealInfo(mealInfo);

    return mealInfo;
  };

  const getIngredients = async (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const incomingEdges = edges.filter((edge) => edge.target === nodeObj.id);

    const previousNodes = incomingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.source)
    );

    if (previousNodes[0]) {
      let mealInfo;

      if (selectedMealInfo) {
        mealInfo = selectedMealInfo;
      } else {
        mealInfo = await getMealsDetailsFn(previousNodes[0].data.label);
      }

      const ingredients: Node[] = [];

      for (let i = 0; i < 5; i++) {
        const ingredient = mealInfo[`strIngredient${i}`];

        // Only add non-empty ingredients
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push({
            id: uuidv4(),
            data: {
              label: ingredient,
              icon: "category",
              type: "ingredient",
              hasEdge: false,
              nodeLevel: nodeObj.data.nodeLevel + 1,
            },
            type: "custom",
            position: {
              x: nodeObj.position.x + 400,
              y: nodeObj.position.y - 100 + i * 100,
            },
          });
        }
      }

      const edges = ingredients.map((node) => ({
        id: `e1-${uuidv4()}`,
        source: nodeObj.id, // Connect to "Explore" node
        target: node.id,
        data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
      }));

      // updateNode(nodeObj);
      setNodes((oldNodes) => [...oldNodes, ...ingredients]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const getTags = async (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const incomingEdges = edges.filter((edge) => edge.target === nodeObj.id);

    const previousNodes = incomingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.source)
    );

    if (previousNodes[0]) {
      let mealInfo;

      if (selectedMealInfo) {
        mealInfo = selectedMealInfo;
      } else {
        mealInfo = await getMealsDetailsFn(previousNodes[0].data.label);
      }

      if (!mealInfo.strTags) return; //TODO show no tags in toast

      const tags: Node[] = [];

      for (let i = 0; i < 5; i++) {
        const allTags = mealInfo.strTags.split(",");

        const tag = allTags[i];

        if (!tag) {
          break;
        }

        tags.push({
          id: uuidv4(),
          data: {
            label: tag,
            hasEdge: false,
            icon: "sell",
            type: "ingredient",
            nodeLevel: nodeObj.data.nodeLevel + 1,
          },
          type: "custom",
          position: {
            x: nodeObj.position.x + 300,
            y: nodeObj.position.y + i * 100 + 100,
          }, // Adjusted positions
        });
      }

      const edges = tags.map((node) => ({
        id: `e1-${uuidv4()}`,
        source: nodeObj.id, // Connect to "Explore" node
        target: node.id,
        data: { nodeLevel: nodeObj.data.nodeLevel + 1 },
      }));

      // updateNode(nodeObj);
      setNodes((oldNodes) => [...oldNodes, ...tags]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const viewDetails = async (nodeObj: Node) => {
    const newNodeLIst = removeOpenedNodeInSameLevel(nodeObj);
    updateNode(nodeObj, newNodeLIst);

    const incomingEdges = edges.filter((edge) => edge.target === nodeObj.id);

    const previousNodes = incomingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.source)
    );

    if (previousNodes[0]) {
      let mealInfo;

      if (selectedMealInfo) {
        mealInfo = selectedMealInfo;
      } else {
        mealInfo = await getMealsDetailsFn(previousNodes[0].data.label);
      }

      // updateNode(nodeObj);
      setSideBar({ show: true, data: mealInfo });
    }
  };

  const onNodeClickHandler = (node: Node) => {
    if (node.data.type === "explore") {
      getAllCategories(node);
    } else if (node.data.type === "category") {
      addViewMeal(node);
    } else if (node.data.type === "viewMeal") {
      getOptionNode(node);
    } else if (node.data.type === "optionNode") {
      addMealOptions(node);
    } else if (node.data.type === "viewIngredients") {
      getIngredients(node);
    } else if (node.data.type === "viewTags") {
      getTags(node);
    } else if (node.data.type === "viewDetails") {
      viewDetails(node);
    } else if (node.data.type === "ingredient") {
      addViewMeal(node);
    }
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
    </div>
  );
};

export default Graph;
