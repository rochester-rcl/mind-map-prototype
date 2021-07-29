// types for all UI components
interface ITextareaProps extends IUIProps {
  onChange?: (value: string) => any;
  onSelect?: (value: any) => any;
  value?: FlattenSimpleInterpolation;
  color?: string;
  background?: string;
  selectedColor?: string;
  caretColor?: string;
}

interface IHighlightedTextProps {
  highlighted: boolean;
  highlightedColor?: string;
}

interface IHighlightedTextDragLayerProps extends IHighlightedTextProps {
  x: number;
  y: number;
}
