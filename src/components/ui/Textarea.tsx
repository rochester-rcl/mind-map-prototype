import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { Palette } from "../../styles/GlobalStyles";

const StyledTextArea = styled(TextareaAutosize)`
  border: none;
  background: ${Palette.offWhite};
  border-radius: 5px;
  padding: 20px;
  resize: none;
  width: 90%;
  height: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  &:focus {
    outline: none;
    border: none;
  }
  color: ${Palette.black};
  caret-color: ${Palette.green};
  &::selection {
    background-color: ${Palette.green};
  }
`;

export default StyledTextArea;
