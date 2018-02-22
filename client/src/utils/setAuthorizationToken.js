import axios from "axios";

// sets the authorization token, so we can decode anything from it

export default function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
