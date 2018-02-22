import axios from "axios";
import setAuthorizationToken from "../utils/setAuthorizationToken";
import { linkLogic } from "../utils/linkLogic";

// one function call that should do the job instead of everything to check if we in prod or dev
var link = linkLogic();

export function setCurrentUser(user) {
  return {
    type: "SET_CURRENT_USER",
    user
  };
}

export function login(data) {
  return dispatch => {
    return axios.post(link + "/users/authenticate", data);
  };
}

export function logout() {
  return dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false); // delete authorization header from future reqs
    dispatch(setCurrentUser({})); // user set to empty object
  };
}
