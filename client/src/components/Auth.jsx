import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import signupImage from '../assets/signup.jpg';

const cookies = new Cookies();
const port = process.env.PORT | 5000;
const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    invalidatePassworderror: '',
    phoneNumber: '',
    avatarURL: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        return regex.test(password);
    }

    const togglePasswordVisibility = () => {
        setForm({ ...form, showPassword: !form.showPassword });
    }

    const checkUsernameAvailability = async (username) => {
        try {
            const URL = `http://localhost:5000/auth/check-username`;
            const response = await axios.post(URL, { username });
            console.log(response);
            return response.data.data.isAvailable;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            const { username, password, confirmPassword } = form;
        
            if (!validatePassword(password)) {
                setForm({ ...form, invalidatePassworderror: 'Password is weak. It should contain at least one digit, one special character, and be at least 6 characters long' });
                return;
            }

            if(validatePassword(password))
            {
                setForm({ ...form, invalidatePassworderro : ''});
            }

            if (password !== confirmPassword) {
                setForm({ ...form, error: 'Passwords do not match' });
                return;
            }

            const isUsernameUnique = await checkUsernameAvailability(username);
            if (!isUsernameUnique) {
                setForm({ ...form, errorUser: 'Username is already taken' });
                return;
            }
        }

        if (!isSignup){
            const { username, password } = form;
            const URL = `http://localhost:5000/auth/login`;

            try {
                const response = await axios.post(URL, {
                    username,
                    password,
                });
                const available = response.data.message.available;
                if (!available) {
                    setForm({ ...form, errorUser: 'invalid credentials' });
                    return;
                }
            } catch (error) {
                setForm({ ...form, errorUser: 'invalid credentials' });
                return;
                // if (error.response && error.response.status === 401) {
                //     setForm({ ...form, error: 'Invalid credentials' });
                // } else {
                //     console.error('Error:', error);
                // }
            }
        };

        const { username, password, phoneNumber, avatarURL } = form;

        const URL = `http://localhost:5000/auth`;

        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, phoneNumber, avatarURL,
        });

        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if(isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    useEffect(() => {
        if(validatePassword(form.password))
        {
            setForm({ ...form, invalidatePassworderror : ''});
        }
    }, [form.password]);


    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input 
                                    name="username" 
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                            <div className="floating-error">{form.errorUser !== '' && (<p>{form.errorUser}</p>)}</div>
                            </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input 
                                    name="phoneNumber" 
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar URL</label>
                                <input 
                                    name="avatarURL" 
                                    type="text"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-container">
                                <input 
                                    name="password" 
                                    type={form.showPassword ? 'text' : 'password'} // Use state to toggle password visibility
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                    {form.showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon toggle */}
                                </span>
                            </div>
                            <div className="floating-error">{form.invalidatePassworderror !== '' && (<p>{form.invalidatePassworderror}</p>)}</div>
                            </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            <div className="floating-error">{form.error && <p>{form.error}</p>}</div>
                            </div>
                            )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Already have an account?" 
                             : "Don't have an account?"
                             }
                             <span onClick={switchMode}>
                             {isSignup ? 'Login' : 'Sign Up'}
                             </span>
                        </p>
                    </div>
                </div> 
            </div>
            <div className="auth__form-container_image">
                <img src={signupImage} alt="sign up" />
            </div>
        </div>
    )
}

export default Auth;

// import React, { useEffect, useState } from 'react';
// import Cookies from 'universal-cookie';
// import axios from 'axios';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// import signupImage from '../assets/signup.jpg';

// const cookies = new Cookies();
// const port = process.env.PORT || 5000;
// const initialState = {
//     fullName: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//     invalidatePassworderror: '',
//     phoneNumber: '',
//     avatarURL: '',
//     errorUser: '',
//     isSignUp: true, // Added state to track sign up or sign in mode
// };

// const Auth = () => {
//     const [form, setForm] = useState(initialState);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const validatePassword = (password) => {
//         const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
//         return regex.test(password);
//     };

//     const togglePasswordVisibility = () => {
//         setForm({ ...form, showPassword: !form.showPassword });
//     };

//     const checkUsernameAvailability = async (username) => {
//         try {
//             const URL = `http://localhost:${port}/auth/check-username`;
//             const response = await axios.post(URL, { username });
//             return response.data.isAvailable;
//         } catch (error) {
//             console.error('Error checking username availability:', error);
//             return false;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const { password, confirmPassword, isSignUp } = form;

//         const { username, phoneNumber, avatarURL } = form;

//         if (isSignUp) {
//             const isUsernameUnique = await checkUsernameAvailability(username);
//             if (!isUsernameUnique) {
//                 setForm({ ...form, errorUser: 'Username is already taken' });
//                 return;
//             }
            
//         if (!validatePassword(password)) {
//             setForm({ ...form, invalidatePassworderror: 'Password is weak. It should contain at least one digit, one special character, and be at least 6 characters long' });
//             return;
//         }

//         if (password !== confirmPassword && isSignUp) {
//             setForm({ ...form, error: 'Passwords do not match' });
//             return;
//         }
//         }else{
//             const URL = `http://localhost:${port}/auth`;

//         try {
//             const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignUp ? 'signup' : 'login'}`, {
//                 username, password, fullName: form.fullName, phoneNumber, avatarURL,
//             });

//             cookies.set('token', token);
//             cookies.set('username', username);
//             cookies.set('fullName', fullName);
//             cookies.set('userId', userId);
//             if (isSignUp) {
//                 cookies.set('phoneNumber', phoneNumber);
//                 cookies.set('avatarURL', avatarURL);
//                 cookies.set('hashedPassword', hashedPassword);
//             }

//             window.location.reload();
//             } catch (error) {
//             console.error('Error during authentication:', error);
//             // Handle error, display appropriate message to the user
//             }
//         }
//     };

//     const switchMode = () => {
//         setForm({ ...form, isSignUp: !form.isSignUp });
//     };

//     useEffect(() => {
//         if(validatePassword(form.password)) {
//             setForm({ ...form, invalidatePassworderror : '' });
//         }
//     }, [form.password]);

//     return (
//         <div className="auth__form-container">
//             <div className="auth__form-container_fields">
//                 <div className="auth__form-container_fields-content">
//                     <p>{form.isSignUp ? 'Sign Up' : 'Sign In'}</p>
//                     <form onSubmit={handleSubmit}>
//                         {form.isSignUp && (
//                             <div className="auth__form-container_fields-content_input">
//                                 <label htmlFor="fullName">Full Name</label>
//                                 <input 
//                                     name="fullName" 
//                                     type="text"
//                                     placeholder="Full Name"
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                         )}
//                         <div className="auth__form-container_fields-content_input">
//                             <label htmlFor="username">Username</label>
//                                 <input 
//                                     name="username" 
//                                     type="text"
//                                     placeholder="Username"
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             <div className="floating-error">{form.errorUser !== '' && (<p>{form.errorUser}</p>)}</div>
//                             </div>
//                         {form.isSignUp && (
//                             <div className="auth__form-container_fields-content_input">
//                                 <label htmlFor="phoneNumber">Phone Number</label>
//                                 <input 
//                                     name="phoneNumber" 
//                                     type="text"
//                                     placeholder="Phone Number"
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                         )}
//                         {form.isSignUp && (
//                             <div className="auth__form-container_fields-content_input">
//                                 <label htmlFor="avatarURL">Avatar URL</label>
//                                 <input 
//                                     name="avatarURL" 
//                                     type="text"
//                                     placeholder="Avatar URL"
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         )}
//                         <div className="auth__form-container_fields-content_input">
//                                 <label htmlFor="password">Password</label>
//                                 <div className="password-input-container">
//                                 <input 
//                                     name="password" 
//                                     type={form.showPassword ? 'text' : 'password'} // Use state to toggle password visibility
//                                     placeholder="Password"
//                                     onChange={handleChange}
//                                     required
//                                 />
//                                 <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
//                                     {form.showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon toggle */}
//                                 </span>
//                             </div>
//                             <div className="floating-error">{form.invalidatePassworderror !== '' && (<p>{form.invalidatePassworderror}</p>)}</div>
//                             </div>
//                         {form.isSignUp && (
//                             <div className="auth__form-container_fields-content_input">
//                                 <label htmlFor="confirmPassword">Confirm Password</label>
//                                 <input 
//                                     name="confirmPassword" 
//                                     type="password"
//                                     placeholder="Confirm Password"
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             <div className="floating-error">{form.error && <p>{form.error}</p>}</div>
//                             </div>
//                             )}
//                         <div className="auth__form-container_fields-content_button">
//                             <button>{form.isSignUp ? "Sign Up" : "Sign In"}</button>
//                         </div>
//                     </form>
//                     <div className="auth__form-container_fields-account">
//                         <p>
//                             {form.isSignUp
//                              ? "Already have an account?" 
//                              : "Don't have an account?"
//                              }
//                              <span onClick={switchMode}>
//                              {form.isSignUp ? 'Login' : 'Sign Up'}
//                              </span>
//                         </p>
//                     </div>
//                 </div> 
//             </div>
//             <div className="auth__form-container_image">
//                 <img src={signupImage} alt="sign up" />
//             </div>
//         </div>
//     )
// }

// export default Auth;
