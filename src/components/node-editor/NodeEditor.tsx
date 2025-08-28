import {
  Fragment,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import { DropTargetMonitor, useDrop, XYCoord } from "react-dnd";
import styled from "styled-components";
import ReactFlow, {
  Background,
  Controls,
  XYPosition,
  addEdge,
  FlowElement,
  Connection,
  Node,
  Edge,
  removeElements,
  OnLoadParams,
  ControlButton
} from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { v4 as uuidv4 } from "uuid";
import TextareaNode, { NodeWidth } from "./TextareaNode";

/* ------------------------------------------------------------------ */
/*  Custom types                                                       */
/* ------------------------------------------------------------------ */

const NodeTypes = { textareaNode: TextareaNode };

/**
 * Public imperative API exposed to the parent component (App)
 * so it can serialise / deserialise the graph.
 */
export interface NodeEditorHandle {
/** Return current *internal* nodes (with `selected`) + edges */
  getMap: () => { nodes: InternalNode[]; edges: Edge[] };
  /** Replace the graph, preserving `selected` metadata */
  loadMap: (data: { nodes: InternalNode[]; edges: Edge[] }) => void;



}

function isDraftSelectedTextNode(
  node: IDraftSelectedTextNode | ISimpleNode
): node is IDraftSelectedTextNode {
  return (node as IDraftSelectedTextNode).selected !== undefined;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const NodeEditor = forwardRef<NodeEditorHandle, INodeEditorProps>(
  (props, ref) => {
    const { onSelectNode, onNodesChange, onDeselectNodes, nodes, edges } = props;

    const [internalNodes, setInternalNodes] = useState<InternalNode[]>([]);
    const [internalEdges, setInternalEdges] = useState<Array<Edge | Connection>>(
      []
    );
    const flowRef = useRef<OnLoadParams | null>(null);

    /* ----------  React‑DND drop setup  ---------- */
    const [, drop] = useDrop(() => ({
      accept: SelectedText,
      drop: handleDrop
    }));

    /* ----------  Helpers for node positioning  ---------- */
    function computeNodePosition(
      offsetNode?: Node | null,
      offsetX = 0,
      offsetY = 20
    ): XYPosition {
      if (!offsetNode) return { x: 0, y: 0 };
      const { x, y } = offsetNode.position;
      return { x: x + offsetX, y: y + offsetY };
    }

    function handleReactFlowLoad(instance: OnLoadParams): void {
      flowRef.current = instance;
    }

    function computeNodePositionFromClientPosition(
      pos: XYCoord | null
    ): XYCoord | null {
      if (flowRef.current && pos) {
        const nodeX = pos.x - Math.floor(NodeWidth / 2);
        return flowRef.current.project({ x: nodeX, y: pos.y });
      }
      return null;
    }

/** inject an onChange callback so TextareaNode can report edits */
function attachOnChange(node: Node): Node {
  return {
    ...node,
    data: {
      ...node.data,
      onChange: (newLabel: string) => handleLabelEdit(node.id, newLabel)
    }
  };
}
function handleLabelEdit(nodeId: string, newLabel: string) {
  setInternalNodes(prev =>
    prev.map(inNode =>
      inNode.node.id === nodeId
        ? {
            ...inNode,
            node: { ...inNode.node, data: { ...inNode.node.data, label: newLabel } }
          }
        : inNode
    )
  );
}






    /* ----------  DND: drop handler (create node)  ---------- */
    function handleDrop(item: IDraftTextSelection, monitor: DropTargetMonitor) {
      const nodePosition = computeNodePositionFromClientPosition(
        monitor.getClientOffset()
      );
      setInternalNodes(oldNodes => {
        const node: Node = attachOnChange({
          id: `node-${uuidv4()}`,
          data: { label: item.text },
          style: { border: `1px solid ${Palette.lightGrey}` },
          type: "textareaNode",
          position:
            nodePosition ||
            computeNodePosition(
              oldNodes.length > 0 ? oldNodes[oldNodes.length - 1].node : null
            )
        });
        const textNode = { node, selected: item };
        return [...oldNodes, textNode];
      });
    }

    /* ----------  Toolbar “+” button: add empty node  ---------- */
    function handleAddEmptyNode() {
      setInternalNodes(oldNodes => {
        const node: Node = attachOnChange({
          id: `node-${uuidv4()}`,
          data: { label: "" },
          style: { border: `1px solid ${Palette.lightGrey}` },
          type: "textareaNode",
          position: { x: 0, y: 0 }
        });
        return [...oldNodes, { node }];
      });
    }

    /* ----------  Edge & element handlers  ---------- */
    function handleAddEdge(params: Edge | Connection) {
      setInternalEdges(oldEdges =>
        addEdge(
          { ...params, animated: false, style: { stroke: Palette.green } },
          oldEdges as FlowElement[]
        ) as (Edge | Connection)[]
      );
    }

    function handleRemoveElements(elements: FlowElement[]) {
      const remainingElements = removeElements(elements, [
        ...internalNodes.map(n => n.node),
        ...(internalEdges as Edge[])
      ]);
      const remainingEdges = remainingElements.filter(isEdge);
      const remainingNodeIds = remainingElements
        .filter(isNode)
        .map(n => n.id);

      setInternalEdges(remainingEdges as Array<Edge | Connection>);
      setInternalNodes(prev =>
        prev.filter(pn => remainingNodeIds.includes(pn.node.id))
      );
    }

    function isEdge(element: FlowElement): element is Edge {
      return (element as Edge).source !== undefined;
    }
    function isNode(element: FlowElement): element is Node {
      return (element as Node).position !== undefined;
    }

    /* ----------  Click / selection handling  ---------- */
    function findInternalNode(id: string): InternalNode | null {
      return internalNodes.find(tn => tn.node.id === id) || null;
    }

    function handleSelectNode(
      _e: React.MouseEvent,
      element: Node | Edge
    ): void {
      const node = findInternalNode(element.id);
      if (node && onSelectNode && isDraftSelectedTextNode(node)) {
        onSelectNode(node);
      } else if (onDeselectNodes) {
        onDeselectNodes();
      }
    }

    function handlePaneClick() {
      onDeselectNodes?.();
    }

    /* ----------  Prop‑driven updates ---------- */
    useEffect(() => {
      setInternalNodes(nodes || []);
      setInternalEdges(edges || []);
    }, [nodes, edges]);

    useEffect(() => {
      if (onNodesChange) {
        onNodesChange(
          internalNodes.filter(isDraftSelectedTextNode) as IDraftSelectedTextNode[]
        );
      }
    }, [internalNodes]);

    /* ----------  Keep positions in sync ---------- */

/* helper: update one InternalNode immutably */
function updatePos(inNode: InternalNode, pos: XYPosition): InternalNode {
  return {
    ...inNode,
    node: { ...inNode.node, position: pos }
  };
}

/**
 * React‑Flow fires a change object whenever a node moves or its data changes.
 * Older versions don’t ship applyNodeChanges, so we handle “position” changes
 * manually here.
 */
/* ----------  Sync positions when a drag ends (v10 API) ---------- */
function handleNodeDragStop(
  _event: any,
  dragged: Node      // final state of the dragged node
) {
  setInternalNodes(prev =>
    prev.map(inNode =>
      inNode.node.id === dragged.id
        ? { ...inNode, node: { ...inNode.node, position: dragged.position } }
        : inNode
    )
  );
}




    /* ----------  Imperative Export / Import API ---------- */
    useImperativeHandle(
      ref,
      () => ({

 /* ----------  EXPORT ---------- */
getMap: () => {
  // 1. Ask React‑Flow for its current state
  const live = flowRef.current?.toObject?.() as any;   // 👈 cast to any
  const liveNodes: Node[] =
    live && live.nodes && live.nodes.length > 0
      ? live.nodes as Node[]
      : internalNodes.map(n => n.node);

  const liveEdges: Edge[] =
    live && live.edges && live.edges.length > 0
      ? live.edges as Edge[]
      : (internalEdges as Edge[]);

  // 2. Build a quick lookup from node‑id → selected payload
  const highlightById: Record<string, IDraftTextSelection> = {};
  internalNodes.forEach(inNode => {
    if ("selected" in inNode) {
      highlightById[inNode.node.id] = (inNode as any).selected;
    }
  });

  // 3. Produce a lightweight snapshot for export
  const nodesForExport = liveNodes.map(n => {
    const cleaned: any = {
      node: {
        id: n.id,
        type: n.type,
        data: n.data,
        style: n.style,
        position: { ...n.position } // current coordinates
      }
    };
    if (highlightById[n.id]) {
      cleaned.selected = highlightById[n.id];
    }
    return cleaned;
  }) as InternalNode[];

  const edgesForExport = liveEdges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    style: e.style
  }));

  return { nodes: nodesForExport, edges: edgesForExport };
},


        /* ----------  IMPORT ---------- */
        loadMap: ({ nodes: newNodes, edges: newEdges }) => {
          setInternalNodes(
   newNodes.map(inNode => ({
     ...inNode,
     node: attachOnChange(inNode.node)
   }))
 );           // restore `selected`
          setInternalEdges(newEdges);
        }
      }),
      [internalNodes, internalEdges]
    );

    /* ----------  Render ---------- */
    const elements = [
      ...internalNodes.map(n => n.node),
      ...internalEdges
    ] as FlowElement[];

    return (
      <Fragment>
        <ReactFlow
          elements={elements}
          ref={drop}
          nodeTypes={NodeTypes}
          onConnect={handleAddEdge}
          onNodeDragStop={handleNodeDragStop}
          onElementClick={handleSelectNode}
          onElementsRemove={handleRemoveElements}
          onPaneClick={handlePaneClick}
          onLoad={handleReactFlowLoad}
          deleteKeyCode={8} /* Delete key */
        >
          <Background color={Palette.blue} size={2} gap={50} />
 
 <Controls
  /* absolute offset inside the canvas */
  style={{
    position: "absolute",   /* keeps it floating */
    left: 245,
    top: 8,
    bottom: "auto",
    border: "none",
    display: "flex",        /* ⬅ switch to row layout */
    flexDirection: "row",
    gap: 6                  /* space between buttons */
  }}
>
  <ControlButton onClick={handleAddEmptyNode}>
    <span style={{ fontSize: 24 }}>&#8853;</span>
  </ControlButton>
</Controls>

        </ReactFlow>
      </Fragment>
    );
  }
);

export default NodeEditor;
