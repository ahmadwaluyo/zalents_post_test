import React, { useEffect, useState } from 'react';
import { postLogin, postRegister } from '../../store/actions';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onFinish = (params, e) => {
        e.preventDefault();
        switch (params) {
            case 'login':
                dispatch(postLogin({
                    email: state.email,
                    password: state.password
                }));
                break;
            default:
                dispatch(postRegister(state));
        }
        setState({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
    };

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    });

    return (
        <div className="container-login">
            <div className="container" id="container">
                <div className="form-container sign-up-container">
                    <form>
                        <h1>Create Account</h1>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" value={state.name} onChange={(e) => setState({...state, name: e.target.value})} />
                        <input type="email" placeholder="Email" value={state.email} onChange={(e) => setState({...state, email: e.target.value})} />
                        <input type="password" placeholder="Password" value={state.password} onChange={(e) => setState({...state, password: e.target.value})} />
                        <input type="password" placeholder="Confirm Password" value={state.confirmPassword} onChange={(e) => setState({...state, confirmPassword: e.target.value})} />
                        <button className="sign-btn" onClick={(e) => onFinish('register', e)}>Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <span className="social"><i className="fab fa-facebook-f"></i></span>
                            <span className="social"><i className="fab fa-google-plus-g"></i></span>
                            <span className="social"><i className="fab fa-linkedin-in"></i></span>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" value={state.email} onChange={(e) => setState({...state, email: e.target.value})} />
                        <input type="password" placeholder="Password" value={state.password} onChange={(e) => setState({...state, password: e.target.value})} />
                        <button className="sign-btn" onClick={(e) => onFinish('login', e)}>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;