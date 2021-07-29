interface ITextEditorProps {
  onSelect?: (selection: IDraftTextSelection) => void;
}

interface IDraftTextSelection {
  anchorKey: string;
  startOffset: number;
  endOffset: number;
  text: string;
}
