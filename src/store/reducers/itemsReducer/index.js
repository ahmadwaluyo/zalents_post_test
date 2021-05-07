import * as actionTypes from '../../actionTypes';

const initialState = {
    items: []
}

const itemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALL_ITEMS:
            return {...state, items: action.payload}
        default:
            return state
    }
}

export default itemsReducer;