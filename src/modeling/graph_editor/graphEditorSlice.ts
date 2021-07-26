import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {RootState } from '../../store'

import { 
    Elements,
    isNode,
    isEdge,
    FlowElement,
} from 'react-flow-renderer/nocss';

interface GraphEditorState {  
  elements: Elements;
}
  
const initialState: GraphEditorState = {
  elements: [],
}
  
export const graphEditorSlice = createSlice({
  name: 'graphEditor',
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Elements>) => {
      state.elements = action.payload;
    }
  }
});

export const selectElements = (state: GraphEditorState) => {
  return state.elements;
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

export const { setElements } = graphEditorSlice.actions
export default graphEditorSlice.reducer
