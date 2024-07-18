import React from 'react';
import './LoginPopup.css';
import { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {assets} from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [curentState, setCurrentState] = React.useState("Login");
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();

        if (curentState === "Sign Up" && data.password !== data.confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }

        let newUrl = url;
        if (curentState === "Login") {
            newUrl = `${url}/api/user/login`;
        } else {
            newUrl = `${url}/api/user/register`;
        }

        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                console.log(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("There was an error!", error);
            toast.error("An error occurred while processing your request. Please try again.");
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{curentState}</h2>
                    <img 
                        src={assets.cross_icon}
                        onClick={() => setShowLogin(false)} 
                        className="close" 
                        alt="close" 
                    />
                </div>

                <div className="login-popup-inputs">
                    {curentState === "Login" ? null : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Name" required />}
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" required />
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
                    {curentState === "Login" ? null : <input name="confirmPassword" onChange={onChangeHandler} value={data.confirmPassword} type="password" placeholder="Confirm Password" required />}
                    <button type="submit">{curentState === "Sign Up" ? "Create Account" : "Login"}</button>
                </div>

                {curentState !== "Login" ? 
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>By creating an account, you agree to our <span>Terms and conditions</span></p>
                    </div> 
                    : null
                }

                {curentState === "Login" ? 
                    <p>
                        Create a new account. 
                        <span className="link" onClick={() => setCurrentState("Sign Up")}>
                            &nbsp;Click here   
                        </span>
                    </p> : 
                    <p>
                        Already have an account? 
                        <span className="link" onClick={() => setCurrentState("Login")}>
                            &nbsp;Login here
                        </span>
                    </p>
                }
            </form>
        </div>
    );
}

export default LoginPopup;
