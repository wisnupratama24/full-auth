import React, { useState } from "react";
import authSvg from "./../assets/auth.svg";
import { ToastContainer, toast } from "react-toastify";
import { isAuth, authenticate } from "./../helpers/auth";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
export const Login = ({ history }) => {
  const [disabled, isDisabled] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const handleChange = (text) => (e) => {
    setFormData({
      ...formData,
      [text]: e.target.value,
    });
  };
  const responseGoogle = (response) => {
    sendGoogleToken(response.tokenId);
  };

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`http://localhost:5000/api/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };
  const sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        informParent(res);
      })
      .catch((err) => {
        toast.error("failed facebook login");
      });
  };
  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/user");
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    isDisabled(true);
    if (email && password) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password,
        })
        .then(function (res) {
          authenticate(res, () => {
            console.log(res);
            setFormData({
              ...formData,
              email: "",
              password: "",
            });
            isAuth() && isAuth().role === "admin"
              ? history.push("/admin")
              : history.push("/user");
            toast.success(res.data.message);
            isDisabled(false);
          });
        })
        .catch((err) => {
          toast.error(err.response.data.error);
          isDisabled(false);
        });
    } else {
      toast.error("Please fill any fields");
      isDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-screen-w-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full flex-1 mt-8 text-indigo-500"
            >
              <div className="mx-auto max-w-s relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleChange("email")}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3"
                />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handleChange("password")}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3"
                />

                <button
                  disabled={disabled}
                  type="submit"
                  className={`mt-5 tracking-wide font-semibold ${
                    disabled === true
                      ? "bg-gray-500"
                      : "bg-indigo-500 hover:bg-indigo-700"
                  }
                  text-gray-100 w-full py-4 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                >
                  Sign In
                </button>
                <Link
                  to="/users/password/forget"
                  className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
                >
                  Forget password?
                </Link>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign with email or social login
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  href="/register"
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                >
                  Sign Up
                </a>
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full mt-3 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    >
                      <div className=" p-2 rounded-full ">
                        <i className="fa fa-google" aria-hidden="true"></i>
                      </div>
                      <span className="ml-4">Sign In with Google</span>
                    </button>
                  )}
                />
                <FacebookLogin
                  appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  fields="name,email,id"
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full mt-3 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    >
                      <div className=" p-2 rounded-full ">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                      </div>
                      <span className="ml-4">Sign In with Facebook</span>
                    </button>
                  )}
                />
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
