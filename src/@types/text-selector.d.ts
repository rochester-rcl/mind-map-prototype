// types for the TextSelector component

interface ITextSelectorProps {
  canEdit?: boolean;
  canDragSelection?: boolean;
  onSelect?: (selection: IDraftTextSelection) => any;
  selectThreshold?: number;
}

interface ITextSelectorDragLayerProps {
  highlightColor?: string;
}
