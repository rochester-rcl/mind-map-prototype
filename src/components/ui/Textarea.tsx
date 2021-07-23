import styled from "styled-components";
import { Palette } from "../../styles/GlobalStyles";

// Basic styled Textarea component
const StyledTextArea = styled.div`
  border: none;
  background: ${(props: ITextareaProps) => props.background || "none"};
  padding: 20px;
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
