import * as actionTypes from '../../actionTypes';

const initialState = {
    token: '',
    messageError: '',
    loadingLogin: false
}

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOGIN:
            return {...state, token: action.token}
        case actionTypes.SET_MODAL_ERROR_LOGIN:
            return {...state, messageError: action.payload.body}
        case actionTypes.SET_LOADING_LOGIN:
            return {...state, loadingLogin: action.status}
        default:
            return state
    }
}

export default loginReducer;