import { useState, useEffect, useContext, createRef } from "react";
import { useDrag } from "react-dnd";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { AppContext } from "../../App";
import TextEditor from "../text-editor/TextEditor";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled, { keyframes } from "styled-components";
import { Palette } from "../../styles/GlobalStyles";
import { Editor } from "draft-js";

const animateScale = keyframes`
  0% {
    transform: scale(1.0);
  }

  50% {
    transform: scale(1.10);
  }

  100% {
    transform: scale(1.0);
  }
`;

const TextSelectorContainer = styled.div`
  height: 100%;
`;

const SelectedTextDisplay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: block;
  position: absolute;
  max-height: 200px;
  max-width: 200px;
  overflow: hidden;
  border-radius: 2px;
  padding: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  z-index: 2;
  animation: ${animateScale} 2s ease-in-out infinite;
  background: ${Palette.green};
  &::hover {
    opacity: 0.6;
  }
`;
/**
 * A basic component for adding and selecting text
 * @param props
 * @returns
 */
export default function TextSelector(props: ITextSelectorProps) {
  const { onSelect } = props;
  const { selectedTextNodes, highlightedTexts } = useContext(AppContext);
  const editorRef = createRef<Editor>();
  // internal component state
  const [selected, setSelected] = useState<IDraftTextSelection | null>(null);

  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: SelectedText,
      item: selected,
      canDrag: () => selected !== null,
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          setSelected(null);
        }
      }
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
    <TextSelectorContainer>
      <TextEditor
        innerRef={editorRef}
        onSelect={setSelected}
        highlightedContent={highlightedTexts}
      />
      {selected ? (
        <SelectedTextDisplay ref={drag}>{selected.text}</SelectedTextDisplay>
      ) : null}
    </TextSelectorContainer>
  );
}
