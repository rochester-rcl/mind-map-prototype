// types for the NodeEditor component

interface INodeEditorProps {
  onDrop?: (selection: ISimpleTextSelection) => void;
  onSelectNode?: (node: ISimpleSelectedTextNode) => void;
  nodes?: ISimpleSelectedTextNode[];
}

interface ISimpleSelectedTextNode {
  flowElement: import("react-flow-renderer").FlowElement;
  selected: ISimpleTextSelection;
}
