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
  overflow-y: auto;
`;

const NodeEditorContainer = styled(ChildContainer)`
  background: ${Palette.offWhite};
`;

const TextSelectorContainer = styled(ChildContainer)`
  flex: 0.4;
  background: ${Palette.white};
  padding: 20px;
  overflow-x: hidden;
`;

const defaultAppCtx: IAppContext = {
  selectedTextNodes: [],
  highlightedTexts: []
};

export const AppContext = createContext<IAppContext>(defaultAppCtx);

/**
 * The main App component - renders global styles as well as
 * the TextSelector and NodeEditor components
 * @returns
 */
function App() {
  const [highlightedTextNodes, setHighlightedTextNodes] = useState<
    IDraftSelectedTextNode[]
  >([]);

  const [selectedTextNodes, setSelectedTextNodes] = useState<
    IDraftSelectedTextNode[]
  >([]);

  function handleSelectNodes(nodes: IDraftSelectedTextNode[]) {
    setHighlightedTextNodes(nodes);
  }

  function handleSelectNode(node: IDraftSelectedTextNode) {
    setHighlightedTextNodes([node]);
  }

  function handleDeselectNodes() {
    setHighlightedTextNodes([]);
  }

  function handleNodesChange(nodes: IDraftSelectedTextNode[]) {
    setSelectedTextNodes(nodes);
    setHighlightedTextNodes((prevHighlighted: IDraftSelectedTextNode[]) => {
      const highlightedIds = prevHighlighted.map(({ node }) => node.id);
      return nodes.filter(({ node }) => highlightedIds.includes(node.id));
    });
  }

  const highlightedTexts = highlightedTextNodes.map(tn => tn.selected);

  return (
    <AppContext.Provider value={{ selectedTextNodes, highlightedTexts }}>
      <GlobalStyle />
      <AppContainer>
        <NodeEditorContainer>
          <NodeEditor
            onSelectNode={handleSelectNode}
            onNodesChange={handleNodesChange}
            onDeselectNodes={handleDeselectNodes}
            onSelectNodes={handleSelectNodes}
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
