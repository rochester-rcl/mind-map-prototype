import { useState, createContext } from "react";
import styled from "styled-components";
import { GlobalStyle, Palette } from "./styles/GlobalStyles";
import TextSelector from "./components/text-selector/TextSelector";
import NodeEditor from "./components/node-editor/NodeEditor";

// Main app container display component
const AppContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

// Child container display component
const ChildContainer = styled.div`
  flex: 0.6;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NodeEditorContainer = styled(ChildContainer)`
  background: ${Palette.offWhite};
`;

const TextSelectorContainer = styled(ChildContainer)`
  flex: 0.4;
  background: ${Palette.white};
  padding: 20px;
`;

const defaultAppCtx: IAppContext = {
  selectedTextNodes: [],
  highlightedTextNode: null
};

export const AppContext = createContext<IAppContext>(defaultAppCtx);

/**
 * The main App component - renders global styles as well as
 * the TextSelector and NodeEditor components
 * @returns
 */
function App() {
  const [highlightedTextNode, setHighlightedTextNode] =
    useState<IDraftSelectedTextNode | null>(null);

  const [selectedTextNodes, setSelectedTextNodes] = useState<
    IDraftSelectedTextNode[]
  >([]);

  function handleSelectNode(node: IDraftSelectedTextNode) {
    setHighlightedTextNode(node);
  }

  function handleNodesChange(nodes: IDraftSelectedTextNode[]) {
    setSelectedTextNodes(nodes);
  }

  return (
    <AppContext.Provider value={{ selectedTextNodes, highlightedTextNode }}>
      <GlobalStyle />
      <AppContainer>
        <NodeEditorContainer>
          <NodeEditor
            onSelectNode={handleSelectNode}
            onNodesChange={handleNodesChange}
          />
        </NodeEditorContainer>
        <TextSelectorContainer>
          <TextSelector />
        </TextSelectorContainer>
      </AppContainer>
    </AppContext.Provider>
  );
}

export default App;
