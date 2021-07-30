import { memo, Fragment } from "react";
import styled from "styled-components";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";
import Textarea from "../ui/Textarea";

// Add additional label styles here
const NodeContainer = styled.div`
  display: flex;
  alignitems: center;
  padding: 20px;
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
  background: ${(props: { selected: boolean }) =>
    props.selected ? Palette.lightGrey : "none"};
`;

/**
 * Basic text display for Node labels
 * @param props
 * @returns
 */
function TextareaNode(props: INodeLabelProps) {
  const { label, selected } = props;
  return (
    <NodeContainer selected={selected}>
      <NodeLabelTextEditorContainer selected={selected}>
        <Textarea defaultValue={label} disabled={!selected} />
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
