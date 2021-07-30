import { Fragment, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
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
  removeElements
} from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { v4 as uuidv4 } from "uuid";
import TextareaNode from "./TextareaNode";

const NodeTypes = {
  textareaNode: TextareaNode
};

/**
 * Drag and drop-enabled node editor that stores ISimpleSelectedTextNodes
 * @param props
 * @returns
 */
export default function NodeEditor(props: INodeEditorProps) {
  const { onSelectNode, onNodesChange, nodes, edges } = props;
  const [internalNodes, setInternalNodes] = useState<IDraftSelectedTextNode[]>(
    []
  );
  const [internalEdges, setInternalEdges] = useState<Array<Edge | Connection>>(
    []
  );

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

  /**
   * Adds a new ISimpleSelectedTextNode based on the ISimpleTextSelection item dropped on this component
   * @param item
   */
  function handleDrop(item: IDraftTextSelection): void {
    // check if item exists already, for now, just create a new node for each drop
    setInternalNodes(oldNodes => {
      const node: Node = {
        id: `node-${uuidv4()}`,
        data: { label: item.text },
        style: { border: `1px solid ${Palette.lightGrey}` },
        type: "textareaNode",
        position: computeNodePosition(
          oldNodes.length > 0 ? oldNodes[oldNodes.length - 1].node : null
        )
      };
      const textNode = { node, selected: item };
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
    setInternalNodes((prevNodes: IDraftSelectedTextNode[]) =>
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

  function findInternalNode(id: string): IDraftSelectedTextNode | null {
    return internalNodes.find(tn => tn.node.id === id) || null;
  }

  function handleSelectNode(event: React.MouseEvent, element: Node | Edge) {
    const { id } = element;
    const node = findInternalNode(id);
    if (node && onSelectNode) {
      onSelectNode(node);
    }
  }

  // will set all internal nodes and edges from the passed in props - can be used for deserialization
  useEffect(() => {
    setInternalNodes(nodes || []);
    setInternalEdges(edges || []);
  }, [nodes, edges]);

  useEffect(() => {
    if (onNodesChange) {
      onNodesChange(internalNodes);
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
        deleteKeyCode={46} /**delete key */
      >
        <Background color={Palette.blue} size={2} gap={50} />
        <Controls />
      </ReactFlow>
    </Fragment>
  );
}
