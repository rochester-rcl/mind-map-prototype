import { Fragment, useEffect, useState, useRef } from "react";
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

const NodeTypes = {
  textareaNode: TextareaNode
};

const ControlButtonIcon = styled.span`
  font-size: 24px;
`;

function isDraftSelectedTextNode(
  node: IDraftSelectedTextNode | ISimpleNode
): node is IDraftSelectedTextNode {
  return (node as IDraftSelectedTextNode).selected !== undefined;
}

/**
 * Drag and drop-enabled node editor that stores ISimpleSelectedTextNodes
 * @param props
 * @returns
 */
export default function NodeEditor(props: INodeEditorProps) {
  const { onSelectNode, onNodesChange, onDeselectNodes, nodes, edges } = props;
  const [internalNodes, setInternalNodes] = useState<InternalNode[]>([]);
  const [internalEdges, setInternalEdges] = useState<Array<Edge | Connection>>(
    []
  );
  const flowRef = useRef<OnLoadParams | null>(null);

  // Hook for enabling dropping of ISimpleTextSelection items
  const [collectedProps, drop] = useDrop(() => ({
    accept: SelectedText,
    drop: handleDrop
  }));

  function computeNodePosition(
    offsetNode?: Node | null,
    offsetX: number = 0,
    offsetY: number = 20
  ): XYPosition {
    if (!offsetNode) {
      return { x: 0, y: 0 };
    }
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

  /**
   * Adds a new ISimpleSelectedTextNode based on the ISimpleTextSelection item dropped on this component
   * @param item
   */
  function handleDrop(
    item: IDraftTextSelection,
    monitor: DropTargetMonitor
  ): void {
    // check if item exists already, for now, just create a new node for each drop
    const nodePosition = computeNodePositionFromClientPosition(
      monitor.getClientOffset()
    );
    setInternalNodes(oldNodes => {
      const node: Node = {
        id: `node-${uuidv4()}`,
        data: { label: item.text },
        style: { border: `1px solid ${Palette.lightGrey}` },
        type: "textareaNode",
        position:
          nodePosition ||
          computeNodePosition(
            oldNodes.length > 0 ? oldNodes[oldNodes.length - 1].node : null
          )
      };
      const textNode = { node, selected: item };
      return [...oldNodes, ...[textNode]];
    });
  }

  function handleAddEmptyNode() {
    setInternalNodes(oldNodes => {
      const node: Node = {
        id: `node-${uuidv4()}`,
        data: { label: "" },
        style: { border: `1px solid ${Palette.lightGrey}` },
        type: "textareaNode",
        position: { x: 0, y: 0 }
      };
      const textNode = { node };
      return [...oldNodes, ...[textNode]];
    });
  }

  function handleRemoveElements(elements: FlowElement[]): void {
    let remainingElements = removeElements(elements, [
      ...internalNodes.map(internalNode => internalNode.node),
      ...(internalEdges as Edge[])
    ]);
    const remainingEdges = remainingElements.filter(elem => isEdge(elem));
    const remainingNodeIds = remainingElements
      .filter(elem => isNode(elem))
      .map(n => n.id);
    setInternalEdges(remainingEdges as Array<Edge | Connection>);
    setInternalNodes((prevNodes: InternalNode[]) =>
      prevNodes.filter(pn => remainingNodeIds.includes(pn.node.id))
    );
  }

  function isEdge(element: FlowElement): element is Edge {
    return (element as Edge).source !== undefined;
  }

  function isNode(element: FlowElement): element is Node {
    return (element as Node).position !== undefined;
  }

  /**
   * Adds a new edge between 2 exising nodes
   * @param params
   */
  function handleAddEdge(params: Edge | Connection) {
    setInternalEdges(oldEdges => {
      const newEdges = addEdge(
        { ...params, animated: false, style: { stroke: Palette.green } },
        oldEdges as FlowElement[]
      );
      return newEdges as (Edge | Connection)[];
    });
  }

  function findInternalNode(id: string): InternalNode | null {
    return internalNodes.find(tn => tn.node.id === id) || null;
  }

  function handleSelectNode(event: React.MouseEvent, element: Node | Edge) {
    const { id } = element;
    const node = findInternalNode(id);
    if (node && onSelectNode && isDraftSelectedTextNode(node)) {
      onSelectNode(node);
    } else {
      if (onDeselectNodes) {
        onDeselectNodes();
      }
    }
  }

  function handlePaneClick(event: React.MouseEvent) {
    if (onDeselectNodes) {
      onDeselectNodes();
    }
  }

  // will set all internal nodes and edges from the passed in props - can be used for deserialization
  useEffect(() => {
    setInternalNodes(nodes || []);
    setInternalEdges(edges || []);
  }, [nodes, edges]);

  useEffect(() => {
    if (onNodesChange) {
      onNodesChange(
        internalNodes.filter(n =>
          isDraftSelectedTextNode(n)
        ) as IDraftSelectedTextNode[]
      );
    }
  }, [internalNodes]);

  let elements = [
    ...internalNodes.map(n => n.node),
    ...internalEdges
  ] as FlowElement[];

  // Renders the ReactFlow component with controls
  return (
    <Fragment>
      <ReactFlow
        elements={elements}
        ref={drop}
        nodeTypes={NodeTypes}
        onConnect={handleAddEdge}
        onElementClick={handleSelectNode}
        onElementsRemove={handleRemoveElements}
        onPaneClick={handlePaneClick}
        onLoad={handleReactFlowLoad}
        deleteKeyCode={46} /**delete key */
      >
        <Background color={Palette.blue} size={2} gap={50} />
        <Controls>
          <ControlButton onClick={handleAddEmptyNode}>
            <ControlButtonIcon>&#8853;</ControlButtonIcon>
          </ControlButton>
        </Controls>
      </ReactFlow>
    </Fragment>
  );
}
