import React, { useState } from "react";
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
  data: { label: string; icon: string; type: string };
  type: string;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
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
      data: { label: "Explore", icon: "explore", type: "explore" },
      type: "custom",
      position: { x: 300, y: 200 },
    },
  ]);
  const [selectedMealInfo, setSelectedMealInfo] = useState<any>();
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sideBar, setSideBar] = useState({ show: false, data: null });

  const { getCategories, getMealsByCategory, getMealDetails } = useService();

  const getAllCategories = async () => {
    const result: Category[] = await getCategories();
    const categories = result.slice(0, 5);

    const categoryNodes = categories.map((category, index) => ({
      id: (index + 2).toString(),
      data: {
        label: category.strCategory,
        icon: "restaurant",
        type: "category",
      },
      type: "custom",
      position: { x: 600, y: 50 + index * 100 }, // Adjusted positions
    }));

    const newEdges = categoryNodes.map((node) => ({
      id: `e1-${node.id}`,
      source: "1", // Connect to "Explore" node
      target: node.id,
    }));

    setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
    setEdges([...newEdges]);
  };

  const addViewMeal = (nodeObj: Node) => {
    const node = {
      id: "7",
      data: { label: "View Meals", icon: "visibility", type: "viewMeal" },
      type: "custom",
      position: { x: nodeObj.position.x + 300, y: nodeObj.position.y }, // Adjusted positions
    };

    const edge = {
      id: `e1-${node.id}`,
      source: nodeObj.id, // Connect to "Explore" node
      target: node.id,
    };

    setNodes((oldNodes) => [...oldNodes, ...[node]]);
    setEdges((newEdges) => [...newEdges, edge]);
  };

  const getOptionNode = async (nodeObj: Node) => {
    const incomingEdges = edges.filter((edge) => edge.target === nodeObj.id);

    const previousNodes = incomingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.source)
    );

    if (previousNodes[0]) {
      const result: OptionNode[] = await getMealsByCategory(
        previousNodes[0].data.label
      );
      const categories = result.slice(0, 5);

      const categoryNodes = categories.map((category, index) => ({
        id: (index + 8).toString(),
        data: {
          label: category.strMeal,
          icon: "dinner_dining",
          type: "optionNode",
        },
        type: "custom",
        position: {
          x: nodeObj.position.x + 400,
          y: nodeObj.position.y - 100 + index * 130,
        }, // Adjusted positions
      }));

      const edges = categoryNodes.map((node) => ({
        id: `e1-${node.id + 8}`,
        source: "7", // Connect to "Explore" node
        target: node.id,
      }));

      setNodes((oldNodes) => [...oldNodes, ...categoryNodes]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const addMealOptions = (node: Node) => {
    const mealOptions = [
      {
        id: "14",
        data: {
          label: "View Ingredients",
          icon: "visibility",
          type: "viewIngredients",
        },
        type: "custom",
        position: { x: node.position.x + 400, y: node.position.y - 100 }, // Adjusted positions
      },
      {
        id: "15",
        data: { label: "View Tags", icon: "visibility", type: "viewTags" },
        type: "custom",
        position: { x: node.position.x + 400, y: node.position.y + 50 }, // Adjusted positions
      },
      {
        id: "16",
        data: {
          label: "View Details",
          icon: "visibility",
          type: "viewDetails",
        },
        type: "custom",
        position: { x: node.position.x + 400, y: node.position.y + 150 }, // Adjusted positions
      },
    ];

    const edges = mealOptions.map((eachNode) => ({
      id: `e1-${eachNode.id}`,
      source: node.id, // Connect to "Explore" node
      target: eachNode.id,
    }));

    setNodes((oldNodes) => [...oldNodes, ...mealOptions]);
    setEdges((newEdges) => [...newEdges, ...edges]);
  };

  const getMealsDetailsFn = async (mealName: string) => {
    const mealInfo = await getMealDetails(mealName);
    setSelectedMealInfo(mealInfo);

    console.log(mealInfo);

    return mealInfo;
  };

  const getIngredients = async (nodeObj: Node) => {
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
            id: (i + 17).toString(),
            data: {
              label: ingredient,
              icon: "category",
              type: "ingredient",
            },
            type: "custom",
            position: {
              x: nodeObj.position.x + 400,
              y: nodeObj.position.y - 100 + i * 100,
            }, // Adjusted positions
          });
        }
      }

      const edges = ingredients.map((node) => ({
        id: `e1-${node.id + 17}`,
        source: nodeObj.id, // Connect to "Explore" node
        target: node.id,
      }));

      console.log({ ingredients, edges });

      setNodes((oldNodes) => [...oldNodes, ...ingredients]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const getTags = async (nodeObj: Node) => {
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
          id: (i + 23).toString(),
          data: { label: tag, icon: "sell", type: "ingredient" },
          type: "custom",
          position: {
            x: nodeObj.position.x + 300,
            y: nodeObj.position.y + i * 100 + 100,
          }, // Adjusted positions
        });
      }

      const edges = tags.map((node) => ({
        id: `e1-${node.id + 23}`,
        source: nodeObj.id, // Connect to "Explore" node
        target: node.id,
      }));

      setNodes((oldNodes) => [...oldNodes, ...tags]);
      setEdges((newEdges) => [...newEdges, ...edges]);
    }
  };

  const viewDetails = async (nodeObj: Node) => {
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

      setSideBar({ show: true, data: mealInfo });
    }
  };

  const onNodeClickHandler = (node: Node) => {
    if (node.data.type === "explore") {
      getAllCategories();
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
