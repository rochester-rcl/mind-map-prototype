// types for the NodeEditor component

interface INodeEditorProps {
  onDrop?: (selection: IDraftTextSelection) => void;
  onSelectNode?: (node: IDraftSelectedTextNode) => void;
  onSelectNodes?: (nodes: IDraftTextSelectionNode[]) => void;
  onNodesChange?: (nodes: IDraftSelectedTextNode[]) => void;
  nodes?: IDraftSelectedTextNode[];
  edges?: (
    | import("react-flow-renderer").Edge
    | import("react-flow-renderer").Connection
  )[];
}

interface INodeLabelProps {
  label: string;
  selected: boolean;
  // add more props here
}

interface IDraftSelectedTextNode {
  node: import("react-flow-renderer").Node;
  selected: IDraftTextSelection;
}
