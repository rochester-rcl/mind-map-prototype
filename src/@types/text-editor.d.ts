interface ITextEditorProps {
  onSelect?: (selection: IDraftTextSelection) => void;
  highlightedContent?: IDraftTextSelection[];
}

interface IDraftTextSelection {
  anchorKey: string;
  startOffset: number;
  endOffset: number;
  text: string;
}
