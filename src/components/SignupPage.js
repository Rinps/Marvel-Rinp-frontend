import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [usermail, setUsermail] = useState("");
  const [password, setPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState(false);
  const history = useHistory();

  const handleNameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleMailChange = (event) => {
    setUsermail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const serverResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
        {
          username: username,
          email: usermail,
          password: password,
        }
      );
      setAccountError(false);
      history.push("/login");
    } catch (error) {
      setAccountError(true);
    }
  };

  return (
    <form className="SignupPage Page" onSubmit={handleSubmit}>
      <h1>CREATE YOUR ACCOUNT</h1>
      <div>
        <p>User name</p>
        <input
          type="text"
          value={username}
          placeholder="Enter your name"
          onChange={handleNameChange}
        />
      </div>
      <div>
        <p>Email</p>
        <input
          type="text"
          value={usermail}
          placeholder="Enter your mail adress"
          onChange={handleMailChange}
        />
      </div>
      <div>
        <p>Password</p>
        <input
          type="text"
          value={password}
          placeholder="Enter your password"
          onChange={handlePasswordChange}
        />
      </div>
      <input id="signupSubmit" type="submit" value="SIGNUP" />
      {accountError && (
        <div>
          An error occured, this account could not be created. Please try
          another username or email adress.
        </div>
      )}
    </form>
  );
};

export default SignupPage;