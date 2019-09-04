import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";

export function* initIngredientsSaga(action) {
  const url = "https://react-my-burger-63ecc.firebaseio.com/ingredients.json";

  try {
    const response = yield axios.get(url);
    yield put(actions.setIngredients(response.data));
  } catch (error) {
    yield put(actions.fetchIngredientsFailed());
  }
}
