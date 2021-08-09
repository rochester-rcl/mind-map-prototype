interface ITextEditorProps {
  onSelect?: (selection: IDraftTextSelection | null) => void;
  highlightedContent?: IDraftTextSelection[];
  innerRef: React.RefObject<
    import("draft-js").Editor
  >;
}

interface IDraftTextSelection {
  anchorKey: string;
  startOffset: number;
  endOffset: number;
  text: string;
}
