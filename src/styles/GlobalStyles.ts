import { createGlobalStyle } from "styled-components";
import "./fonts.css";
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
    }

    #root {
        height: 100%;
        width: 100%;
    }
`;
