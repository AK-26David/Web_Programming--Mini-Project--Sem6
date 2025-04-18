import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from '../../Axios/axios';
import UserContext from '../../Context/userContext';
import Navbar from '../Landing Pages/Navbar';
import "./login.css";
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const context = useContext(UserContext);
  let { showAlert } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`/api/auth/login`,
      {
        email: credentials.email,
        password: credentials.password,
      }).catch((e) => {
        console.log(e.response.data.error);
        showAlert("Invalid Credentials please check!!!!!", "danger");
      })
    if (response.data.success) {
      // Save the authtoken and redirect
      localStorage.setItem("token", response.data.authtoken);
      showAlert("Logged In Successfully!!!", "success");
      navigate("/dashboard");
    }
    setCredentials({ email: "", password: "" });
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
        <Navbar />
        <div className="card mx-auto login__card">
          <form onSubmit={handleSubmit}>
            <div className="row g-0">
              <div className="col-lg-6 col-sm-12">
                <img src="data:image/png;base64,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" className="img-fluid rounded-start login__image" alt="login" />
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="card-body">
                  <div className="login__head">Welcome Back!</div>
                  <div className="login__para">Login to continue</div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <i className="fa-solid fa-user email__icon"></i>
                      <input type="email"
                        className="input__email"
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onChange} />
                    </div>
                    <div className="col-md-12 col-sm-12">
                      <i className="fa-solid fa-lock password__icon"></i>
                      <input type="password"
                        className="input__password"
                        placeholder="Enter Password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onChange} />
                    </div>
                    <div className="col-md-12 col-sm-12 login__btn">
                      <input type="submit" className="login__button" value="Login" />
                    </div>
                    <div className="col-md-12 col-sm-12 go__signup">
                      <p className="text-center">Not a Member?<Link to="/signup">SignUp</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
  )
}

export default Login;