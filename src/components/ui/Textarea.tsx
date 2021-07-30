import styled from "styled-components";
import { Palette } from "../../styles/GlobalStyles";
import TextareaAutosize from "react-textarea-autosize";

// Basic styled Textarea component
const StyledTextArea = styled(TextareaAutosize)`
  border: none;
  background: ${(props: ITextareaProps) => props.background || "none"};
  padding: 5px;
  resize: none;
  width: 90%;
  height: 100%;
  &:focus {
    outline: none;
    border: none;
  }
  color: ${(props: ITextareaProps) => props.color || Palette.black};
  caret-color: ${(props: ITextareaProps) => props.caretColor || Palette.green};
  &::selection {
    background-color: ${(props: ITextareaProps) =>
      props.selectedColor || Palette.green};
  }
`;

export default StyledTextArea;
