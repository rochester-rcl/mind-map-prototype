import React, { useState, useEffect } from "react";
import Textarea from "../ui/Textarea";

interface IPagePosition {
  pageX: number;
  pageY: number;
}

/**
 * A basic component for adding and selecting text
 * @param props 
 * @returns 
 */
export default function TextSelector(props: ITextSelectorProps) {
  const { onSelect, selectThreshold } = props;
  // internal component state
  const [selecting, setSelecting] = useState(false);
  const [startPos, setStartPos] = useState<IPagePosition | null>(null);
  const [endPos, setEndPos] = useState<IPagePosition | null>(null);
  const [selected, setSelected] = useState<ISimpleTextSelection | null>(null);

  // mousedown event handler
  function handleMouseDown(evt: React.MouseEvent<HTMLTextAreaElement>) {
    const { pageX, pageY } = evt;
    setSelecting(true);
    setStartPos({ pageX, pageY });
  }

  // mouseup event handler
  function handleMouseUp(evt: React.MouseEvent<HTMLTextAreaElement>) {
    const { pageX, pageY } = evt;
    setSelecting(false);
    setEndPos({ pageX, pageY });
  }

  // checks to see whether or not the user dragged the mouse
  function didMouseDrag(
    start: IPagePosition,
    end: IPagePosition,
    threshold: number
  ): boolean {
    return (
      Math.abs(start.pageX - end.pageX) > threshold ||
      Math.abs(end.pageY - end.pageY) > threshold
    );
  }

  // this callback is only called when startPos, endPos, or selectThreshold values are changed
  useEffect(() => {
    if (!selecting && startPos && endPos) {
      if (didMouseDrag(startPos, endPos, selectThreshold || 5)) {
        let selected = window.getSelection();
        if (selected) {
          setSelected({
            text: selected.toString(),
            range: selected.getRangeAt(0)
          });
        }
      }
    }
  }, [selecting, startPos, endPos, selectThreshold]);

  // this callback is only called when selected or onSelect is changed
  useEffect(() => {
    if (selected && onSelect) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  return (
    <Textarea
      placeholder="Paste text ..."
      minRows={20}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}
