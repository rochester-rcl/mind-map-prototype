import { memo, Fragment, useState, MouseEvent } from "react";
import styled from "styled-components";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";
import Textarea from "../ui/Textarea";

export const NodeWidth = 200;

// Add additional label styles here
const NodeContainer = styled.div`
  display: flex;
  alignitems: center;
  padding: 20px;
  width: ${NodeWidth}px;
  border: 1px solid ${(props: { selected: boolean }) =>
    props.selected ? Palette.green : Palette.lightGrey}};
  background: ${Palette.white};
  box-shadow: ${(props: { selected: boolean }) =>
    props.selected
      ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      : "none"};
  &:hover {
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    border: 1px solid ${Palette.green};
  }
`;

const NodeLabelTextEditorContainer = styled.div`
  border: 1px solid
    ${(props: { selected: boolean }) =>
      props.selected ? Palette.lightGrey : Palette.white};
  &:hover {
    border: 1px solid ${Palette.lightGrey};
    cursor: text;
  }
`;

/**
 * Basic text display for Node labels
 * @param props
 * @returns
 */
function TextareaNode(props: INodeLabelProps) {
  const { label, selected } = props;
  const [active, setActive] = useState(false);

  function handleSetActive() {
    setActive(true);
  }

  function handleTextareaMouseDown(evt: MouseEvent<HTMLTextAreaElement>) {
    // disable drag when selecting text
    evt.stopPropagation();
  }

  return (
    <NodeContainer selected={selected}>
      <NodeLabelTextEditorContainer
        selected={selected && active}
        onClick={handleSetActive}
      >
        <Textarea
          defaultValue={label}
          disabled={!selected && !active}
          onMouseDown={handleTextareaMouseDown}
        />
      </NodeLabelTextEditorContainer>
    </NodeContainer>
  );
}

export default memo((props: NodeProps) => {
  const { data, isConnectable, selected } = props;
  return (
    <Fragment>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: Palette.green }}
        isConnectable={isConnectable}
      />
      <TextareaNode label={data.label} selected={selected} />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: Palette.black }}
        isConnectable={isConnectable}
      />
    </Fragment>
  );
});
