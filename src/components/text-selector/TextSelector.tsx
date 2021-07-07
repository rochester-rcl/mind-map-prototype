import React, { useState, useEffect } from "react";
import Textarea from "../ui/Textarea";

interface IPagePosition {
  pageX: number;
  pageY: number;
}

export default function TextSelector(props: ITextSelectorProps) {
  const { onSelect, selectThreshold } = props;
  const [selecting, setSelecting] = useState(false);
  const [startPos, setStartPos] = useState<IPagePosition | null>(null);
  const [endPos, setEndPos] = useState<IPagePosition | null>(null);
  const [selected, setSelected] = useState<ISimpleTextSelection | null>(null);

  function handleMouseDown(evt: React.MouseEvent<HTMLTextAreaElement>) {
    const { pageX, pageY } = evt;
    setSelecting(true);
    setStartPos({ pageX, pageY });
  }

  function handleMouseUp(evt: React.MouseEvent<HTMLTextAreaElement>) {
    const { pageX, pageY } = evt;
    setSelecting(false);
    setEndPos({ pageX, pageY });
  }

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
