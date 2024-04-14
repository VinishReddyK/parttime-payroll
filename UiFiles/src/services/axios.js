import { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:3000`,
  timeout: 10000,
});

const ErrorAlert = ({ errorMessage, onClose }) => {
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>Error!</Alert.Heading>
      <p>{errorMessage}</p>
    </Alert>
  );
};

const ApiWrapper = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["jwt-access-token"] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 440) {
        localStorage.removeItem("token");
        redirectToLogin();
      } else {
        setErrorMessage(error.response.message);
      }
      return Promise.reject(error);
    }
  );

  const handleClose = () => setErrorMessage(null);

  return (
    <div>
      {errorMessage && <ErrorAlert errorMessage={errorMessage} onClose={handleClose} />}
      {children}
    </div>
  );
};

export { api };
export default ApiWrapper;
