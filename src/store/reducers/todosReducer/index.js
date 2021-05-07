import * as actionTypes from '../../actionTypes';

const initialState = {
    todos: []
}

const todosReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALL_TODOS:
            return {...state, todos: action.payload}
        default:
            return state
    }
}

export default todosReducer;