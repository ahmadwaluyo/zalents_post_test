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

const apiPatch = (url, data, token, params) => {
    return axios({
        url,
        method: 'PATCH',
        params,
        data,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST,HEAD, OPTIONS,PUT, DELETE, PATCH'
        }
    })
}

const apiDelete = (url, token, params) => {
    return axios({
        url,
        method: 'DELETE',
        params,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
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
        dispatch({
            type: actionTypes.SET_LOADING_LOGIN,
            status: true
        });
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
            });
            window.location.reload();
        })
        .catch(err => {
            notification.error({
                message: 'Your input is invalid !'
            });
        })
        .finally(_ => {
            dispatch({
                type: actionTypes.SET_LOADING_LOGIN,
                status: false
            });
        })
    }
}


/* Todos */

export const getAllTodos = (token) => {
    return async (dispatch) => {
        dispatch(({
            type: actionTypes.SET_LOADING_TODOS,
            status: true
        }));
        await apiGet(`${baseUrl}/todos`, token)
        .then(({data}) => {
            Promise.all(data.map(async (el) => {
                let temp = await apiGet(`${baseUrl}/todos/${el.id}/items`, token);
                el.detail = temp.data;
            }));
            setTimeout(() => {
                dispatch({
                    type: actionTypes.SET_ALL_TODOS,
                    payload: data
                });
            }, 1500)
        })
        .catch(err => {
            notification.error({
                message: err.message
            });
        })
        .finally(_ => {
            dispatch(({
                type: actionTypes.SET_LOADING_TODOS,
                status: false
            }));
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
            notification.error({
                message: err.message
            });
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
            notification.error({
                message: err.message
            });
        });
    }
}

export const postItem = (token, params, body, rightOrLeft) => {
    return (dispatch) => {
        apiPost(`${baseUrl}/todos/${params}/items`,body, token)
        .then(({data}) => {
            if (rightOrLeft === 'right') {
                dispatch(deleteItem(token, params-1, body.id, 'moved'));
                notification.success({
                    message: 'Item moved to right successfully !'
                });
            } else if (rightOrLeft === 'left'){
                dispatch(deleteItem(token, params+1, body.id, 'moved'));
                notification.success({
                    message: 'Item moved to left successfully !'
                });
            } else {
                notification.success({
                    message: 'Item created successfully !'
                });
            }
        })
        .catch(err => {
            notification.error({
                message: err.message
            });
        })
    }
}

export const updateItem = (token, paramsTodo, paramsItem, body) => {
    return (dispatch) => {
        apiPatch(`${baseUrl}/todos/${paramsTodo}/items/${paramsItem}`, body, token)
        .then(({data}) => {
            console.log(data);
            notification.success({
                message: 'Item has successfully updated !'
            });
        })
        .catch(err => {
            notification.error({
                message: err.message === 'Network Error' ? 'Your request has been block by CORS policy !' : 'Invalid Input !'
            });
        })
    }
}

export const deleteItem = (token, paramsTodo, paramsItem, moved) => {
    return (dispatch) => {
        apiDelete(`${baseUrl}/todos/${paramsTodo}/items/${paramsItem}`, token)
        .then(({data}) => {
            console.log(data)
            if (!moved) {
                notification.success({
                    message: 'Item deleted successfully !'
                });
            }
        })
        .catch(err => {
            notification.error({
                message: 'Failed to delete item !'
            });
        })
    }
}

export const moveRightItem = (token, params, body) => {
    return (dispatch) => {
        dispatch(postItem(token, params+1, body, 'right')); 
    }
}

export const moveLeftItem = (token, params, body) => {
    return (dispatch) => { 
        dispatch(postItem(token, params-1, body, 'left'));
    }
}