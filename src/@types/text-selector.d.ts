// types for the TextSelector component

interface ITextSelectorProps {
  onSelect?: (selection: ISimpleTextSelection) => any;
  selectThreshold?: number;
}

interface ISimpleTextSelection {
  text: string;
  range: Range;
}
