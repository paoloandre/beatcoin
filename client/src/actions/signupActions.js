import axios from "axios";
import { linkLogic } from "../utils/linkLogic";

var link = linkLogic();


export function userSignupRequest(userData) {
  return dispatch => {
    return axios.post(link + "/users/register", userData);
  };
}
