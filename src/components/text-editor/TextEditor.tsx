import { useState, useEffect } from "react";
import { Editor, EditorState, SelectionState } from "draft-js";

export default function TextEditor(props: ITextEditorProps) {
  const { onSelect } = props;
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [currentSelection, setCurrentSelection] =
    useState<IDraftTextSelection | null>(null);

  function handleGetSelection(selectionState: SelectionState) {
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
  
  return <Editor editorState={editorState} onChange={setEditorState} />;
}
