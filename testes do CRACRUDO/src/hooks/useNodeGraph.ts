"use client";

import { useState, useCallback, useRef } from "react";
import type { YggNode, YggEdge, YggNodeType, ConnectionType } from "@/types/yggnarok";
import { getNodeTypeDef } from "@/utils/nodeTypeRegistry";
import { calculateGridPositions } from "@/utils/gridCalculator";
import { logger } from "@/lib/utils";

let _nodeId = 0;
function nextNodeId(): string {
  _nodeId++;
  return `node-${Date.now()}-${_nodeId}`;
}

let _edgeId = 0;
function nextEdgeId(): string {
  _edgeId++;
  return `edge-${Date.now()}-${_edgeId}`;
}

export interface NodeGraphState {
  nodes: YggNode[];
  edges: YggEdge[];
  selectedNodeId: string | null;
  connectingFromId: string | null;
}

type NodeGraphAction =
  | { type: "addNode"; node: YggNode }
  | { type: "removeNode"; id: string }
  | { type: "moveNode"; id: string; position: { x: number; y: number } }
  | { type: "updateNode"; id: string; patch: Partial<YggNode> }
  | { type: "addEdge"; edge: YggEdge }
  | { type: "removeEdge"; id: string }
  | { type: "selectNode"; id: string | null }
  | { type: "startConnection"; fromId: string }
  | { type: "cancelConnection" }
  | { type: "finishConnection"; toId: string; edgeType?: ConnectionType }
  | { type: "setNodes"; nodes: YggNode[] }
  | { type: "setEdges"; edges: YggEdge[] };

function applyAction(state: NodeGraphState, action: NodeGraphAction): NodeGraphState {
  switch (action.type) {
    case "addNode":
      return { ...state, nodes: [...state.nodes, action.node] };
    case "removeNode": {
      const nodes = state.nodes.filter((n) => n.id !== action.id);
      const edges = state.edges.filter(
        (e) => e.sourceId !== action.id && e.targetId !== action.id
      );
      return {
        ...state,
        nodes,
        edges,
        selectedNodeId:
          state.selectedNodeId === action.id ? null : state.selectedNodeId,
      };
    }
    case "moveNode": {
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.id ? { ...n, position: action.position } : n
        ),
      };
    }
    case "updateNode": {
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.id ? { ...n, ...action.patch } : n
        ),
      };
    }
    case "addEdge":
      return { ...state, edges: [...state.edges, action.edge] };
    case "removeEdge": {
      return {
        ...state,
        edges: state.edges.filter((e) => e.id !== action.id),
      };
    }
    case "selectNode":
      return { ...state, selectedNodeId: action.id };
    case "startConnection":
      return { ...state, connectingFromId: action.fromId };
    case "cancelConnection":
      return { ...state, connectingFromId: null };
    case "finishConnection": {
      const fromId = state.connectingFromId ?? "";
      if (!fromId || fromId === action.toId) return { ...state, connectingFromId: null };
      // avoid duplicate
      const exists = state.edges.some(
        (e) =>
          (e.sourceId === fromId && e.targetId === action.toId) ||
          (e.sourceId === action.toId && e.targetId === fromId)
      );
      if (exists) return { ...state, connectingFromId: null };
      const edge: YggEdge = {
        id: nextEdgeId(),
        sourceId: fromId,
        targetId: action.toId,
        type: action.edgeType || "related_to",
      };
      // Also sync node.connections array
      const nodes = state.nodes.map((n) => {
        if (n.id === fromId) {
          return {
            ...n,
            connections: [
              ...n.connections,
              { targetId: action.toId, connectionType: edge.type },
            ],
          };
        }
        return n;
      });
      return {
        ...state,
        nodes,
        edges: [...state.edges, edge],
        connectingFromId: null,
      };
    }
    case "setNodes":
      return { ...state, nodes: action.nodes };
    case "setEdges":
      return { ...state, edges: action.edges };
    default:
      return state;
  }
}

export function useNodeGraph(initialNodes: YggNode[] = [], initialEdges: YggEdge[] = []) {
  const [state, setState] = useState<NodeGraphState>({
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId: initialNodes.length > 0 ? initialNodes[0].id : null,
    connectingFromId: null,
  });

  // History stack for undo/redo — stored in state to satisfy strict linter rules
  const [history, setHistory] = useState<{ stack: NodeGraphState[]; index: number }>({
    stack: [state],
    index: 0,
  });
  const canUndo = history.index > 0;
  const canRedo = history.index < history.stack.length - 1;

  const pushHistory = useCallback((next: NodeGraphState) => {
    setHistory((prev) => {
      const stack = prev.stack.slice(0, prev.index + 1);
      stack.push(next);
      if (stack.length > 200) stack.shift();
      return { stack, index: stack.length - 1 };
    });
    setState(next);
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.index <= 0) return prev;
      const nextIdx = prev.index - 1;
      setState(prev.stack[nextIdx]);
      return { ...prev, index: nextIdx };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.index >= prev.stack.length - 1) return prev;
      const nextIdx = prev.index + 1;
      setState(prev.stack[nextIdx]);
      return { ...prev, index: nextIdx };
    });
  }, []);

  const dispatch = useCallback(
    (action: NodeGraphAction) => {
      const next = applyAction(state, action);
      pushHistory(next);
    },
    [state, pushHistory]
  );

  const selectedNode =
    state.nodes.find((n) => n.id === state.selectedNodeId) || null;

  const addNode = useCallback(
    (type: YggNodeType, position?: { x: number; y: number }) => {
      const def = getNodeTypeDef(type);
      const pos =
        position || { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 };
      const now = new Date().toISOString();
      const node: YggNode = {
        id: nextNodeId(),
        type,
        position: pos,
        dimensions: { width: def.defaultWidth, height: def.defaultHeight },
        zIndex: 1,
        data: {},
        connections: [],
        metadata: {
          createdAt: now,
          updatedAt: now,
          createdBy: "current-user",
          tags: [],
        },
      };
      dispatch({ type: "addNode", node });
      dispatch({ type: "selectNode", id: node.id });
      logger.debug("Node added:", node.id, type);
    },
    [dispatch]
  );

  const deleteNode = useCallback(
    (id: string) => {
      dispatch({ type: "removeNode", id });
    },
    [dispatch]
  );

  const moveNode = useCallback(
    (id: string, position: { x: number; y: number }) => {
      dispatch({ type: "moveNode", id, position });
    },
    [dispatch]
  );

  const updateNode = useCallback(
    (id: string, patch: Partial<YggNode>) => {
      dispatch({ type: "updateNode", id, patch });
    },
    [dispatch]
  );

  const selectNode = useCallback(
    (id: string | null) => dispatch({ type: "selectNode", id }),
    [dispatch]
  );

  const startConnection = useCallback(
    (fromId: string) => dispatch({ type: "startConnection", fromId }),
    [dispatch]
  );

  const finishConnection = useCallback(
    (toId: string, edgeType?: ConnectionType) =>
      dispatch({ type: "finishConnection", toId, edgeType }),
    [dispatch]
  );

  const cancelConnection = useCallback(
    () => dispatch({ type: "cancelConnection" }),
    [dispatch]
  );

  const deleteEdge = useCallback(
    (id: string) => dispatch({ type: "removeEdge", id }),
    [dispatch]
  );

  const applyGridLayout = useCallback(() => {
    const positions = calculateGridPositions(state.nodes);
    const nodes = state.nodes.map((n) => {
      const pos = positions.get(n.id);
      if (!pos) return n;
      return { ...n, position: pos };
    });
    dispatch({ type: "setNodes", nodes });
  }, [state.nodes, dispatch]);

  return {
    nodes: state.nodes,
    edges: state.edges,
    selectedNodeId: state.selectedNodeId,
    selectedNode,
    connectingFromId: state.connectingFromId,
    addNode,
    deleteNode,
    moveNode,
    updateNode,
    selectNode,
    startConnection,
    finishConnection,
    cancelConnection,
    deleteEdge,
    applyGridLayout,
    undo,
    redo,
    canUndo,
    canRedo,
    dispatch,
  };
}
