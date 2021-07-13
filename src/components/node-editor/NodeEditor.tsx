import { Fragment, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import ReactFlow, {
  Background,
  Controls,
  XYPosition,
  Node
} from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";
import { SelectedText } from "../../constants/DragAndDropItemTypes";

const NodeLabelDisplay = styled.div`
    text-overflow: ellipsis;
`;

function NodeLabel(props: INodeLabelProps) {
  const { label } = props;
  return <NodeLabelDisplay>{label}</NodeLabelDisplay>;
}

export default function NodeEditor(props: INodeEditorProps) {
  let { onDrop, onSelectNode, nodes } = props;
  let [internalNodes, setInternalNodes] = useState<ISimpleSelectedTextNode[]>(
    []
  );

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

  function handleDrop(item: ISimpleTextSelection) {
    // check if item exists already, for now, just create a new node for each drop
    setInternalNodes(oldNodes => {
      const node: Node = {
        id: `node-${(oldNodes.length + 1).toString()}`,
        data: { label: <NodeLabel label={item.text} /> },
        position: computeNodePosition(
          oldNodes.length > 0 ? oldNodes[oldNodes.length - 1].node : null
        )
      };
      return [...oldNodes, ...[{ node, selected: item }]];
    });
  }

  useEffect(() => {
    setInternalNodes(nodes || []);
  }, [nodes]);

  let elements = internalNodes.map(n => n.node);

  return (
    <Fragment>
      <ReactFlow elements={elements} ref={drop}>
        <Background color={Palette.blue} size={2} gap={50} />
        <Controls />
      </ReactFlow>
    </Fragment>
  );
}
