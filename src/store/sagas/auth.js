import { put, delay, call } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "axios";

export function* logoutSaga(action) {
  // using Call makes generator test able
  yield call([localStorage, "removeItem"], "token");
  yield call([localStorage, "removeItem"], "expirationDate");
  yield call([localStorage, "removeItem"], "userId");
  // yield localStorage.removeItem("token");
  // yield localStorage.removeItem("expirationDate");
  // yield localStorage.removeItem("userId");
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };

  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDr6EV8Sjogq_CVXw7n5YPAdTZjXvJCF7g";

  if (!action.isSignUp) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDr6EV8Sjogq_CVXw7n5YPAdTZjXvJCF7g";
  }
  try {
    const response = yield axios.post(url, authData);

    const expDate = yield new Date(
      new Date() + response.data.expirationTime * 1000
    );
    yield localStorage.setItem("token", response.data.idToken);
    yield localStorage.setItem("expirationDate", expDate);
    yield localStorage.setItem("userId", response.data.localId);
    yield put(
      actions.authSuccess(response.data.idToken, response.data.localId)
    );
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(aciton) {
  const token = yield localStorage.getItem("storage");
  if (token == null) {
    yield put(actions.logout());
  }
  const expDate = yield new Date(localStorage.getItem("expirationDate"));
  if (expDate < new Date()) {
    yield put(actions.logout());
  } else {
    const userId = yield localStorage.getItem("userId");
    put(actions.authSuccess(token, userId));
    put(
      actions.checkAuthTimeout(
        (expDate.getTime() - new Date().getTime()) / 1000
      )
    );
  }
}
