import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axiosConfig from "../../API/axiosConfig";
import { Container, Form, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const LOGIN_URL = "/auth/login";

const Login = () => {
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosConfig.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response));
      const jwtToken = response?.data?.jwtToken;
      const roles = response?.data?.roles;
      const firstName = response?.data?.firstName;
      const id = response?.data?.id;
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(response);
        console.log(response.data.jwtToken);
        //email, firstName, id, jwtToken, roles
        return {
          email: response.data.email,
          firstName: response.data.firstName,
          id: response.data.id,
          jwtToken: response.data.jwtToken,
          roles: response.data.roles,
        };
      });
      setEmail("");
      setPassword("");
      navigate("/home", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
        console.log("Auth object: " + auth);
        console.log("Error message: " + err);
      } else if (err.response?.status === 400) {
        setErrMsg("Missing email or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login failed");
      }

      errRef.current.focus();
    }
  };

  return (
    <Container
      className="login-signup d-flex flex-column min-vh-100 justify-content-center align-items-center"
      fluid
    >
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
        style={{ color: "white" }}
      >
        {errMsg}
      </p>
      <Form className="login-form" onSubmit={handleSubmit}>
        <h2 style={{ color: "white" }} className="mb-3">
          Sign in
        </h2>

        <Col xs="auto" className="mb-3">
          <Form.Label style={{ color: "white" }}>Email</Form.Label>
          <Form.Control
            type="text"
            id="email"
            placeholder="Enter your email"
            ref={emailRef}
            autoComplete="off"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Label style={{ color: "white" }}>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Enter password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Col>

        <button className="btn btn-info mt-3">SIGN IN</button>
      </Form>
    </Container>
  );
};

export default Login;
