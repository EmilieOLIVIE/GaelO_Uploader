// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, SELECT_SERIES, SERIES_READY } from '../actions/actions-types'

const initialState = {
  selectedStudy: undefined,
  selectedSeries: undefined,
  seriesReady: []
}

export default function DisplayTablesReducer (state = initialState, action) {
  switch (action.type) {
    case SELECT_STUDY:
      // SK ICI PREVOIR LE MEME TYPE DE FONCTION QUE SERIES POUR LE MULTIUPLOADER
      return {
        ...state,
        selectedStudy: action.payload
      }

    case SELECT_SERIES:
      return {
        ...state,
        selectedSeries: action.payload.row.seriesInstanceUID
      }

    case SERIES_READY:
      if (action.payload.isSelect) {
        return {
          ...state,
          seriesReady: [...state.seriesReady, action.payload.validSeriesID]
        }
      } else if (!action.payload.isSelect) {
        return {
          ...state,
          seriesReady: state.seriesReady.filter(thisRowID => thisRowID !== action.payload.validSeriesID)
        }
      }

    default:
      return state
  }
}
