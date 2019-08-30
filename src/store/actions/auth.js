import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return { type: actionTypes.AUTH_START };
};
export const authSuccess = (token, userId) => {
  return { type: actionTypes.AUTH_SUCCESS, idToken: token, userId: userId };
};
export const authFail = error => {
  return { type: actionTypes.AUTH_FAIL, error: error };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return { type: actionTypes.AUTH_LOGOUT };
};
export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDr6EV8Sjogq_CVXw7n5YPAdTZjXvJCF7g";
    if (!isSignUp) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDr6EV8Sjogq_CVXw7n5YPAdTZjXvJCF7g";
    }
    axios
      .post(url, authData)
      .then(response => {
        const expDate = new Date(
          new Date() + response.data.expirationTime * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expDate);
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => dispatch(authFail(err.response.data.error)));
  };
};
export const setAuthRedirectPath = path => {
  return { type: actionTypes.SET_AUTH_REDIRECT_PATH, path: path };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("storage");
    if (token == null) {
      return;
    }
    const expDate = new Date(localStorage.getItem("expirationDate"));
    if (expDate < new Date()) {
      dispatch(logout);
    } else {
      const userId = localStorage.getItem("userId");
      dispatch(authSuccess(token, userId));
      dispatch(
        checkAuthTimeout((expDate.getTime() - new Date().getTime()) / 1000)
      );
    }
  };
};
