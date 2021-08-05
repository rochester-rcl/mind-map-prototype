import {
  useRef,
  useState,
  useEffect,
  useContext,
  MouseEvent,
  createRef,
  RefObject
} from "react";
import { useDrag } from "react-dnd";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { AppContext } from "../../App";
import TextEditor from "../text-editor/TextEditor";
import { getEmptyImage } from "react-dnd-html5-backend";
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

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  return (
    <div ref={drag}>
      <TextEditor
        onSelect={setSelected}
        highlightedContent={highlightedTexts}
      />
    </div>
  );
}
