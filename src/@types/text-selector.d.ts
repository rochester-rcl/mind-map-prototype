// types for the TextSelector component

interface ITextSelectorProps {
  canEdit?: boolean;
  canDragSelection?: boolean;
  onSelect?: (selection: ISimpleTextSelection) => any;
  selectThreshold?: number;
}

interface ISimpleTextSelection {
  text: string;
  range: Range;
}
