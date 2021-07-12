import { Fragment } from "react";
import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant
} from "react-flow-renderer";
import { Palette } from "../../styles/GlobalStyles";

export default function NodeEditor(props: INodeEditorProps) {
  let { onDrop, onSelectNode, nodes } = props;

  let elements = nodes ? nodes.map(n => n.flowElement) : [];
  return (
    <Fragment>
      <ReactFlow elements={elements}>
        <Background color={Palette.blue} size={2} gap={50} />
        <Controls />
      </ReactFlow>
    </Fragment>
  );
}
