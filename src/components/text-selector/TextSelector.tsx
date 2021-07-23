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
import styled from "styled-components";
import Textarea from "../ui/Textarea";
import { SelectedText } from "../../constants/DragAndDropItemTypes";
import { Palette } from "../../styles/GlobalStyles";
import { AppContext } from "../../App";

interface IPagePosition {
  pageX: number;
  pageY: number;
}

const HighlightedText = styled.span`
  background: ${(props: IHighlightedTextProps) =>
    props.highlighted ? props.highlightedColor || Palette.green : "none"};
`;

interface INodeRefMap {
  [key: string]: RefObject<HTMLDivElement>;
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
  const [selecting, setSelecting] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<IPagePosition | null>(null);
  const [endPos, setEndPos] = useState<IPagePosition | null>(null);
  const [selected, setSelected] = useState<ISimpleTextSelection | null>(null);
  const [innerText, setInnerText] = useState<string>("");

  const textareaRef = useRef<HTMLDivElement>(null);
  // hold a list of all refs based on the current nodes
  const [selectedTextRefs, setSelectedTextRefs] = useState<INodeRefMap>({});

  // text change event handler
  function handleTextChange() {
    const { current } = textareaRef;
    if (current) {
      setInnerText(current.innerText);
    }
  }

  // mousedown event handler
  function handleMouseDown(evt: MouseEvent<HTMLDivElement>) {
    const { pageX, pageY } = evt;
    setSelecting(true);
    setStartPos({ pageX, pageY });
  }

  // mouseup event handler
  function handleMouseUp(evt: MouseEvent<HTMLDivElement>) {
    const { pageX, pageY } = evt;
    setSelecting(false);
    setEndPos({ pageX, pageY });
  }

  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: SelectedText,
      item: selected,
      canDrag: () => selected !== null,
      collect: monitor => ({ isDragging: monitor.isDragging() })
    }),
    [selected]
  );

  // checks to see whether or not the user dragged the mouse
  function didMouseSelect(
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
      if (didMouseSelect(startPos, endPos, selectThreshold || 5)) {
        const selected = window.getSelection();
        if (selected && selected.rangeCount) {
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

  useEffect(() => {
    const nodeRefs = selectedTextNodes.reduce((refs: INodeRefMap, textNode) => {
      refs[textNode.node.id] = createRef();
      return refs;
    }, {});
    setSelectedTextRefs(nodeRefs);
  }, [selectedTextNodes]);

  useEffect(() => {
    // wrap all selected node ranges
    for (const textNode of selectedTextNodes) {
      const { node, selected } = textNode;
      const ref = selectedTextRefs[node.id];
      if (ref && ref.current) {
        // check to make sure content isn't already in the node
        if (ref.current.innerText === "") {
          selected.range.surroundContents(ref.current);
        }
      }
    }
  }, [selectedTextRefs, selectedTextNodes]);

  return (
    <div ref={drag}>
      <Textarea
        ref={textareaRef}
        contentEditable={true}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onInput={handleTextChange}
        value={innerText}
      />
      {selectedTextNodes.map(tn => (
        <HighlightedText
          highlighted={
            (highlightedTextNode &&
              highlightedTextNode.node.id === tn.node.id) ||
            false
          }
          key={tn.node.id}
          ref={selectedTextRefs[tn.node.id]}
        />
      ))}
    </div>
  );
}
