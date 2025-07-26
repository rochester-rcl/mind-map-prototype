import { useState, useEffect, createRef, ReactNode } from "react";
import {
  Editor,
  EditorState,
  SelectionState,
  ContentBlock,
  CompositeDecorator,
  ContentState
} from "draft-js";
import styled from "styled-components";
import { Palette } from "../../styles/GlobalStyles";

/* ------------------------------------------------------------------ */
/*  Styled components                                                  */
/* ------------------------------------------------------------------ */

const HighlightedText = styled.span`
  background: ${(props: IHighlightedTextProps) =>
    props.highlighted ? props.highlightedColor || Palette.green : "none"};
`;

const EditorContainer = styled.div`
  height: 100%;
  caret-color: ${(props: ITextareaProps) => props.caretColor || Palette.green};
  &::selection {
    color: ${(props: ITextareaProps) => props.selectedColor || Palette.green};
  }
`;

/* ------------------------------------------------------------------ */
/*  Decorator helpers                                                  */
/* ------------------------------------------------------------------ */

interface IDraftDecoratorProps {
  children: ReactNode;
  [key: string]: any;
}
function Highlighted(props: IDraftDecoratorProps) {
  const highlightedRef = createRef<HTMLSpanElement>();

  useEffect(() => {
    highlightedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, [highlightedRef]);

  return (
    <HighlightedText ref={highlightedRef} {...props} highlighted={true}>
      {props.children}
    </HighlightedText>
  );
}

function selectedStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  highlightedContent: IDraftTextSelection[]
): void {
  const blockKey = contentBlock.getKey();
  const blockText = contentBlock.getText();

  highlightedContent.forEach(sel => {
    // 1. Fast path – exact same block as in the original editor
    if (blockKey === sel.anchorKey) {
      const snippet = blockText.slice(sel.startOffset, sel.endOffset);
      if (snippet === sel.text) callback(sel.startOffset, sel.endOffset);
      return; // done with this selection
    }

    // 2. Fallback – block key changed after import
    //    → look for the exact text inside this block
    if (sel.text) {
      const idx = blockText.indexOf(sel.text);
      if (idx !== -1) callback(idx, idx + sel.text.length);
    }
  });
}


function createHighlightDecorator(
  highlightedContent: IDraftTextSelection[]
): CompositeDecorator {
  return new CompositeDecorator([
    {
      strategy: (block, cb) => selectedStrategy(block, cb, highlightedContent),
      component: Highlighted
    }
  ]);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Extra props added by Patch 1
 *  – `initialText` : fill editor on first render *and* future imports
 *  – `onChange`    : bubble the plain text to the parent
 */
export default function TextEditor(
  props: ITextEditorProps & {
    initialText?: string;
    onChange?: (plain: string) => void;
  }
) {
  const {
    onSelect,
    highlightedContent,
    innerRef,
    initialText = "",
    onChange
  } = props;

  /* ----------  Editor state ---------- */
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromText(initialText),
      createHighlightDecorator(highlightedContent || [])
    )
  );

  /* ----------  Selection handling ---------- */
  const [currentSelection, setCurrentSelection] =
    useState<IDraftTextSelection | null>(null);

  function updateCurrentSelection(selectionState: SelectionState) {
    const anchorKey = selectionState.getAnchorKey();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(anchorKey);
    const startOffset = selectionState.getStartOffset();
    const endOffset = selectionState.getEndOffset();
    const text = block.getText().slice(startOffset, endOffset);

    setCurrentSelection(
      text ? { text, anchorKey, startOffset, endOffset } : null
    );
  }

  /* ----------  Effects ---------- */
  useEffect(() => updateCurrentSelection(editorState.getSelection()), [
    editorState
  ]);

  useEffect(() => {
    onSelect?.(currentSelection);
  }, [currentSelection]);

  /* Re‑apply decorator when highlights change */
  useEffect(() => {
    if (highlightedContent) {
      setEditorState(es =>
        EditorState.set(es, {
          decorator: createHighlightDecorator(highlightedContent)
        })
      );
    }
  }, [highlightedContent]);

  /* Sync external text (Import Map) */
  useEffect(() => {
    const txt = editorState.getCurrentContent().getPlainText();
    if (initialText !== txt) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(initialText),
          createHighlightDecorator(highlightedContent || [])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText]);

  /* ----------  Local change handler ---------- */
  function handleChange(state: EditorState) {
    setEditorState(state);
    onChange?.(state.getCurrentContent().getPlainText());
  }

  /* ----------  Render ---------- */
  return (
    <EditorContainer>
      <Editor
        ref={innerRef}
        editorState={editorState}
        onChange={handleChange}
      />
    </EditorContainer>
  );
}
