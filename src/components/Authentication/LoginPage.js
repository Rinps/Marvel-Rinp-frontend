import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const LoginPage = (props) => {
  const { setLoggedIn } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleNameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/login?username=${username}&password=${password}`
      );
      const token = apiResponse.data;
      Cookies.set("marvel-token", token, { expires: 2 });
      setLoggedIn(Cookies.get("marvel-token"));
      history.push("/");
    } catch (error) {
      console.log(error.response.data);
      setLoggedIn();
    }
  };

  return (
    <form className="LoginPage Page" onSubmit={handleSubmit}>
      <h1>LOGIN FORM</h1>
      <input
        type="text"
        value={username}
        placeholder="Enter your username"
        onChange={handleNameChange}
      />
      <input
        type="text"
        value={password}
        placeholder="Enter your password"
        onChange={handlePasswordChange}
      />
      <input id="loginSubmit" type="submit" value="LOG ME IN" />
    </form>
  );
};

export default LoginPage;
