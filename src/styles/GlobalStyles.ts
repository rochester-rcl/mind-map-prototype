import { createGlobalStyle } from "styled-components";
import "./fonts.css";

// Color palette for the UI
// https://coolors.co/eeeeff-5fb0b7-1a192b-f5348e-5bc8af
export const Palette = {
  offWhite: "#EEEEFF",
  white: "#FCFCFF",
  black: "#1A192B",
  red: "#F5348E",
  green: "#5BC8AF",
  blue: "#5FB0B7",
  lightGrey: "#EAE1DF"
};

// Styles to be applied globally
export const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
    }

    body {
        margin: 0;
        padding: 0;
        background: ${Palette.white};
        height: 100vh;
        width: 100vw;
        position: relative;
        display: flex;
    }

    #root {
        height: 100%;
        width: 100%;
        position: relative;
        display: flex;
    }

    .DraftEditor-root, .DraftEditor-editorContainer, .public-DraftEditor-content {
        height: 100%;
    }
`;
