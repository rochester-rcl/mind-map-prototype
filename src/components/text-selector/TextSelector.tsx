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
import styled from "styled-components";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { AppContext } from "../../App";
import TextEditor from "../text-editor/TextEditor";

const HighlightedTextDragLayer = styled.span`
  position: absolute;
  top: ${(props: IHighlightedTextDragLayerProps) => props.y};
  left: ${(props: IHighlightedTextDragLayerProps) => props.x};
`;

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

  const { selectedTextNodes, highlightedTexts } = useContext(AppContext);

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
      <TextEditor
        onSelect={setSelected}
        highlightedContent={highlightedTexts}
      />
      {/*collected.isDragging ? (
        <TextSelectorDragLayer dragPreview={dragPreview} />
      ) : null*/}
    </div>
  );
}
