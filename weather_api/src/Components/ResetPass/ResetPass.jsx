import React, { useState, useContext } from 'react';
import './ResetPass.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const ResetPass = ({ setShowReset }) => {
    const { url, userData } = useContext(StoreContext);
    const [data, setData] = useState({
        email: userData.email,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const toggleOldPasswordVisibility = () => {
        setOldPasswordVisible(!oldPasswordVisible);
    }

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    }

    const toggleConfirmNewPasswordVisibility = () => {
        setConfirmNewPasswordVisible(!confirmNewPasswordVisible);
    }

    const onResetPassword = async (event) => {
        event.preventDefault();
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New passwords do not match. Please try again.");
            return;
        }
        try {
            const response = await axios.post(`${url}/api/user/password`, data);
            if (response.data.success) {
                setShowReset(false);
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
        <div className='reset-pass-popup'>
            <form onSubmit={onResetPassword} className="reset-pass-popup-container">
                <div className="reset-pass-popup-title">
                    <h2>Reset Password</h2>
                    <img 
                        src={assets.cross_icon}
                        onClick={() => setShowReset(false)} 
                        className="close" 
                        alt="close" 
                    />
                </div>

                <div className="reset-pass-popup-inputs">
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" disabled={true} placeholder="Email" required />
                    <div className="password-container">
                        <input
                            name="oldPassword"
                            onChange={onChangeHandler}
                            value={data.oldPassword}
                            type={oldPasswordVisible ? "text" : "password"}
                            placeholder="Old Password"
                            required
                        />
                        <a onClick={toggleOldPasswordVisibility}>
                            {oldPasswordVisible ? "Hide" : "Show"}
                        </a>
                    </div>
                    <div className="password-container">
                        <input
                            name="newPassword"
                            onChange={onChangeHandler}
                            value={data.newPassword}
                            type={newPasswordVisible ? "text" : "password"}
                            placeholder="New Password"
                            required
                        />
                        <a onClick={toggleNewPasswordVisibility}>
                            {newPasswordVisible ? "Hide" : "Show"}
                        </a>
                    </div>
                    <div className="password-container">
                        <input
                            name="confirmNewPassword"
                            onChange={onChangeHandler}
                            value={data.confirmNewPassword}
                            type={confirmNewPasswordVisible ? "text" : "password"}
                            placeholder="Confirm New Password"
                            required
                        />
                        <a onClick={toggleConfirmNewPasswordVisibility}>
                            {confirmNewPasswordVisible ? "Hide" : "Show"}
                        </a>
                    </div>
                    <button type="submit">Reset Password</button>
                </div>
            </form>
        </div>
    );
}

export default ResetPass;
