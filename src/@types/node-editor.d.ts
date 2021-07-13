// types for the NodeEditor component

interface INodeEditorProps {
  onDrop?: (selection: ISimpleTextSelection) => void;
  onSelectNode?: (node: ISimpleSelectedTextNode) => void;
  nodes?: ISimpleSelectedTextNode[];
  edges?: (
    | import("react-flow-renderer").Edge
    | import("react-flow-renderer").Connection
  )[];
}

interface INodeLabelProps {
  label: string;
  // add more props here
}

interface ISimpleSelectedTextNode {
  node: import("react-flow-renderer").Node;
  selected: ISimpleTextSelection;
}
