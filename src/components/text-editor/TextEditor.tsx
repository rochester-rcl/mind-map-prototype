import { useState, useEffect, useMemo } from "react";
import {
  Editor,
  EditorState,
  SelectionState,
  ContentBlock,
  CompositeDecorator
} from "draft-js";
import styled, { css } from "styled-components";
import { Palette } from "../../styles/GlobalStyles";

const HighlightedText = styled.span`
  background: ${(props: IHighlightedTextProps) =>
    props.highlighted ? props.highlightedColor || Palette.green : "none"};
`;

function Highlighted({ children }: any) {
  return <HighlightedText highlighted={true}>{children}</HighlightedText>;
}

const EditorContainer = styled.div`
  caret-color: ${(props: ITextareaProps) => props.caretColor || Palette.green};
  &::selection {
    color: ${(props: ITextareaProps) => props.selectedColor || Palette.green};
  }
`;

function selectedStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  highlightedContent: IDraftTextSelection[]
): void {
  for (const highlighted of highlightedContent) {
    const { anchorKey, startOffset, endOffset, text } = highlighted;
    const key = contentBlock.getKey();
    if (key === anchorKey) {
      // make sure text matches
      const contentText = contentBlock.getText().slice(startOffset, endOffset);
      if (contentText === text) {
        callback(startOffset, endOffset);
      }
    }
  }
}

function createHighlightDecorator(
  highlightedContent: IDraftTextSelection[]
): CompositeDecorator {
  return new CompositeDecorator([
    {
      strategy: (
        contentBlock: ContentBlock,
        callback: (start: number, end: number) => void
      ) => {
        selectedStrategy(contentBlock, callback, highlightedContent);
      },
      component: Highlighted
    }
  ]);
}

export default function TextEditor(props: ITextEditorProps) {
  const { onSelect, highlightedContent } = props;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(createHighlightDecorator([]))
  );
  const [currentSelection, setCurrentSelection] =
    useState<IDraftTextSelection | null>(null);

  function handleGetSelection(selectionState: SelectionState): void {
    const anchorKey = selectionState.getAnchorKey();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(anchorKey);
    const startOffset = selectionState.getStartOffset();
    const endOffset = selectionState.getEndOffset();
    const text = block.getText().slice(startOffset, endOffset);
    setCurrentSelection({ text, startOffset, endOffset, anchorKey });
  }

  useEffect(() => {
    handleGetSelection(editorState.getSelection());
  }, [editorState]);

  useEffect(() => {
    if (onSelect && currentSelection) {
      onSelect(currentSelection);
    }
  }, [currentSelection]);

  useEffect(() => {
    if (highlightedContent) {
      setEditorState(
        EditorState.set(editorState, {
          decorator: createHighlightDecorator(highlightedContent)
        })
      );
    }
  }, [highlightedContent]);

  return (
    <EditorContainer>
      <Editor editorState={editorState} onChange={setEditorState} />
    </EditorContainer>
  );
}
