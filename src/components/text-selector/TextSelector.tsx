import {
  useRef,
  useState,
  useEffect,
  useContext,
  MouseEvent,
  createRef,
  RefObject
} from "react";
import { useDrag, useDragLayer } from "react-dnd";
import styled, { css } from "styled-components";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { Palette } from "../../styles/GlobalStyles";
import { AppContext } from "../../App";
import TextEditor from "../text-editor/TextEditor";

interface IPagePosition {
  pageX: number;
  pageY: number;
}

const HighlightedTextMixin = css`
  background: ${(props: IHighlightedTextProps) =>
    props.highlighted ? props.highlightedColor || Palette.green : "none"};
`;

const HighlightedText = styled.span`
  ${HighlightedTextMixin}
`;

const HighlightedTextDragLayer = styled.span`
  ${HighlightedTextMixin}
  position: absolute;
  top: ${(props: IHighlightedTextDragLayerProps) => props.y};
  left: ${(props: IHighlightedTextDragLayerProps) => props.x};
`;

interface INodeRefMap {
  [key: string]: RefObject<HTMLDivElement>;
}

/**
 *
 * @param props
 * @returns
 */
function TextSelectorDragLayer(props: ITextSelectorDragLayerProps) {
  const { highlightColor, dragPreview } = props;
  const { item, isDragging, offset } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging(),
    offset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
    itemType: SelectedText
  }));
  const { x, y } = offset || { x: 0, y: 0 };
  if (!isDragging) {
    return null;
  }
  return (
    <HighlightedTextDragLayer
      ref={dragPreview}
      highlightedColor={highlightColor}
      highlighted={true}
      x={x}
      y={y}
    >
      {item.text}
    </HighlightedTextDragLayer>
  );
}

/**
 * A basic component for adding and selecting text
 * @param props
 * @returns
 */
export default function TextSelector(props: ITextSelectorProps) {
  const { onSelect, selectThreshold } = props;

  const { selectedTextNodes, highlightedTextNode } = useContext(AppContext);

  // internal component state
  const [selected, setSelected] = useState<IDraftTextSelection | null>(null);

  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: SelectedText,
      item: selected,
      canDrag: () => selected !== null,
      collect: monitor => ({ isDragging: monitor.isDragging() })
    }),
    [selected]
  );

  // this callback is only called when selected or onSelect is changed
  useEffect(() => {
    if (selected && onSelect) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  return (
    <div ref={drag}>
      <TextEditor onSelect={setSelected} />
      {/*collected.isDragging ? (
        <TextSelectorDragLayer dragPreview={dragPreview} />
      ) : null*/}
    </div>
  );
}
