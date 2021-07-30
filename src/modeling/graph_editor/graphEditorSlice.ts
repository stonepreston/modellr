import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { 
    Elements,
    FlowTransform,
    FlowElement,
    isNode,
    isEdge
} from 'react-flow-renderer/nocss';

interface GraphEditorState {  
  elements: Elements;
  transform: FlowTransform
}

  
const initialState: GraphEditorState = {
  elements: [],
  transform: {x: 0.0, y: 0.0, zoom: 1.0}
}
  
export const graphEditorSlice = createSlice({
  name: 'graphEditor',
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Elements>) => {
      state.elements = action.payload;
    },

    setTransform: (state, action: PayloadAction<FlowTransform>) => {
      state.transform = action.payload;
    },
  }
});

export const selectElements = (state: RootState) => {
  return state.graphEditor.elements;
}


export const selectTransform = (state: RootState) => {
  return state.graphEditor.transform;
}

export const selectModelNodes = (state: RootState) => {
  let modelNodes: FlowElement[] = []
  state.graphEditor.elements.forEach(function (element: FlowElement) {
    if (isNode(element)) {
      modelNodes.push(element);
    }
  });

  return modelNodes;
}

export const selectEdgeNodes = (state: RootState) => {
  let edgeNodes: FlowElement[] = []
  state.graphEditor.elements.forEach(function (element: FlowElement) {
    if (isEdge(element)) {
      edgeNodes.push(element);
    }
  });

  return edgeNodes;
}

export const { setElements, setTransform } = graphEditorSlice.actions
export default graphEditorSlice.reducer
