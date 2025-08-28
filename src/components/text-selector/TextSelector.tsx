import { useState, useEffect, useContext, createRef } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled, { keyframes } from "styled-components";
import { Editor } from "draft-js";

import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { AppContext } from "../../App";
import TextEditor from "../text-editor/TextEditor";
import { Palette } from "../../styles/GlobalStyles";

/* ------------------------------------------------------------------ */
/*  Styled components                                                  */
/* ------------------------------------------------------------------ */

const animateScale = keyframes`
  0%   { transform: scale(1);   }
  50%  { transform: scale(1.10);}
  100% { transform: scale(1);   }
`;

const TextSelectorContainer = styled.div`
  height: 100%;
`;

const SelectedTextDisplay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
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
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Extra props in Patch 1
 * – `initialText` : fill editor initially / on import
 * – `onChange`    : emit plain text upward
 */
export default function TextSelector(
  props: ITextSelectorProps & {
    initialText?: string;
    onChange?: (plain: string) => void;
  }
) {
  const { onSelect, initialText = "", onChange } = props;

  const { selectedTextNodes, highlightedTexts } = useContext(AppContext);
  const editorRef = createRef<Editor>();

  /* ----------  Drag‑n‑drop selection state ---------- */
  const [selected, setSelected] = useState<IDraftTextSelection | null>(null);

  const [, drag, dragPreview] = useDrag(
    () => ({
      type: SelectedText,
      item: selected,
      canDrag: () => selected !== null,
      end: (_item, monitor) => {
        if (monitor.didDrop()) setSelected(null);
      }
    }),
    [selected]
  );

  /* Call parent on selection */
  useEffect(() => {
    if (selected && onSelect) onSelect(selected);
  }, [selected, onSelect]);

  /* Hide default drag preview */
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  /* ----------  Render ---------- */
  return (
    <TextSelectorContainer>
      <TextEditor
        innerRef={editorRef}
        onSelect={setSelected}
        highlightedContent={highlightedTexts}
        initialText={initialText}
        onChange={onChange}
      />
      {selected ? (
        <SelectedTextDisplay ref={drag}>
          {selected.text}
        </SelectedTextDisplay>
      ) : null}
    </TextSelectorContainer>
  );
}
