import axios from 'axios';
import { notification } from 'antd';
import * as actionTypes from '../actionTypes';

/* Main API */

const baseUrl = 'https://todos-project-api.herokuapp.com';

const apiGet = (url, token, params) => {
    return axios({
        url,
        method: 'GET',
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const apiPost = (url, data, token, params) => {
    if (token) {
        return axios({
            url,
            method: 'POST',
            params,
            data,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } else {
        return axios({
            url,
            method: 'POST',
            params,
            data
        })
    }
}

const apiPatch = (url, data, params, token) => {
    return axios({
        url,
        method: 'PATCH',
        params,
        data,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const apiDelete = (url, token, params) => {
    return axios({
        url,
        method: 'DELETE',
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}


/* Login & Register */

export const postRegister = (body) => {
    return async (dispatch) => {
        await apiPost(`${baseUrl}/signup`, body)
        .then(({data}) => {
            dispatch({
                type: actionTypes.SET_REGISTER,
                token: data.auth_token,
                message: data.message
            })
        })
        .catch(err => {
            dispatch({
                type: actionTypes.SET_MODAL_ERROR_REGISTER,
                payload: {
                    title: 'ERROR REGISTER ACCOUNT!',
                    body: 'Your input is invalid !'
                }
            })
        })
    }
}

export const postLogin = (body) => {
    return async (dispatch) => {
        await apiPost(`${baseUrl}/auth/login`, body)
        .then(({data}) => {
            const token = {
                status: true,
                token: data.auth_token
            };
            localStorage.setItem("isLogin", JSON.stringify(token, null, 2));
            dispatch({
                type: actionTypes.SET_LOGIN,
                token: data.auth_token,
                message: data.message
            })
            window.location.reload();
        })
        .catch(err => {
            notification.error({
                message: 'Your input is invalid !'
            });
        })
    }
}


/* Todos */

export const getAllTodos = (token) => {
    return async (dispatch) => {
        await apiGet(`${baseUrl}/todos`, token)
        .then(({data}) => {
            Promise.all(data.map(async (el) => {
                let temp = await apiGet(`${baseUrl}/todos/${el.id}/items`, token);
                el.detail = temp.data;
            }));
            dispatch({
                type: actionTypes.SET_ALL_TODOS,
                payload: data
            });
            console.log(data, "get all cards")
        })
        .catch(err => {
            console.log(err.message)
        })
    }
}

export const postTodo = (token, body) => {
    return async (dispatch) => {
        await apiPost(`${baseUrl}/todos`, body, token)
        .then(({data}) => {
            console.log(data, 'data post')
            notification.success({
                message: 'Todo created successfully !'
            });
        })
        .catch(err => {
            console.log(err.message)
        });
    }
}

/* Items */
export const getAllItems = (token, params) => {
    return async (dispatch) => {
        await apiGet(`${baseUrl}/todos/${params}/items`, token)
        .then(({data}) => {
            dispatch({
                type: actionTypes.SET_ALL_ITEMS,
                payload: data
            });
        })
        .catch(err => {
            console.log(err)
        });
    }
}

export const postItem = (token, params, body, rightOrLeft) => {
    return (dispatch) => {
        apiPost(`${baseUrl}/todos/${params}/items`,body, token)
        .then(({data}) => {
            notification.success({
                message: 'Item created successfully !'
            });
            if (rightOrLeft) {
                deleteItem(token, params, body.id)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
}

export const updateItem = (token, paramsTodo, paramsItem, body) => {
    return (dispatch) => {
        apiPatch(`${baseUrl}/todos/${paramsTodo}/items/${paramsItem}`, token, body)
        .then(({data}) => {
            console.log(data);
        })
        .catch(err => {
            console.log(err)
        })
    }
}

export const deleteItem = (token, paramsTodo, paramsItem) => {
    console.log('masuk ga')
    return (dispatch) => {
        apiDelete(`${baseUrl}/todos/${paramsTodo}/items/${paramsItem}`, token)
        .then(({data}) => {
            notification.success({
                message: 'Item deleted successfully !'
            });
        })
        .catch(err => {
            notification.error({
                message: 'Failed to delete item !'
            });
        })
    }
}

export const moveRightItem = (token, params, body) => {
    return postItem(token, params+1, body, 'right'); 
}

export const moveLeftItem = (token, params, body) => {
    return postItem(token, params-1, body, 'left');
}