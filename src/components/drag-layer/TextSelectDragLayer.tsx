import styled from "styled-components";
import { useDragLayer } from "react-dnd";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { Palette } from "../../styles/GlobalStyles";

const HighlightedTextDragLayer = styled.span.attrs(
  (props: IHighlightedTextDragLayerProps) => ({
    style: {
      transform: `translate(
        ${props.x}px,
        ${props.y}px
      )`
    }
  })
)`
  display: block;
  position: absolute;
  max-height: 200px;
  max-width: 200px;
  overflow: hidden;
  border-radius: 2px;
  padding: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: ${(props: IHighlightedTextDragLayerProps) =>
    props.highlightedColor || Palette.green};
`;

/**
 *
 * @param props
 * @returns
 */
export default function TextSelectorDragLayer(
  props: ITextSelectorDragLayerProps
) {
  const { highlightColor } = props;
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
      highlightedColor={highlightColor}
      highlighted={true}
      x={x}
      y={y}
    >
      {item.text}
    </HighlightedTextDragLayer>
  );
}
