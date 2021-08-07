import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export interface ResultItem {
  name: string;
  value: number[];
}

  
interface ResultsState {  
   results: ResultItem[];
}

  
const initialState: ResultsState = {
  results: []
}
  
export const resultsSlice = createSlice({
  name: 'resultsSlice',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<ResultItem[]>) => {
      console.log("action payload: ", action.payload);
      state.results = action.payload;
    },
  }
});

export const selectResults = (state: RootState) => {
  return state.results.results;
}

export const { setResults } = resultsSlice.actions
export default resultsSlice.reducer
