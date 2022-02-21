import React, { useState, useContext, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ERROR_MESSAGE, API_URL, API_ROUTE } from "../constants";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { CommonContext } from "../CommonContext";

function Login() {
  const history = useNavigate();
  const inputElement = createRef();
  const {
    token,
    setToken,
    isDragging,
    setIsDragging,
    currentUser,
    setCurrentUser,
  } = useContext(CommonContext);

  const [loading, setLoading] = useState(false);
  console.log(
    `localStorage.getItem("AUTH_TOKEN"): ${localStorage.getItem("AUTH_TOKEN")}`
  );
  console.log(`token: ${token}`);
  useEffect(() => {
    if (token) {
      history("/dashboard");
    }
    inputElement?.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      captcha: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(ERROR_MESSAGE.emailRequired),
      password: Yup.string()
        .required(ERROR_MESSAGE.passRequired)
        .min(6, ERROR_MESSAGE.passwordMinSix),
      captcha: Yup.string().required(ERROR_MESSAGE.captchaRequired),
    }),
    onSubmit: (values) => {
      submitData(values);
    },
  });

  const submitData = async (data) => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/${API_ROUTE.user}`);
    console.log(res.data);
    if (
      res.data.find(
        (elem) =>
          (elem.userName === data.email || elem.email === data.email) &&
          elem.password === data.password
      )
    ) {
      setLoading(false);
      setCurrentUser(
        res.data.find(
          (elem) =>
            (elem.userName === data.email || elem.email === data.email) &&
            elem.password === data.password
        )
      );
      setToken(true);
      localStorage.setItem("AUTH_TOKEN", true);
      const C_U = res.data.find(
        (elem) =>
          (elem.userName === data.email || elem.email === data.email) &&
          elem.password === data.password
      );
      localStorage.setItem(
        "C_U",
        JSON.stringify({ fullName: C_U.fullName, profile: C_U.profile })
      );
      history("/dashboard");
    } else {
      setLoading(false);
      setToken(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    history("/desktop");
  };

  function onChange(value) {
    formik.setFieldValue("captcha", value);
  }
  return (
    <div className="container mt-4 mb-3">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          {/* <label className="col-6">Enter Email: </label> */}
          <input
            ref={inputElement}
            className="mx-auto"
            type="email"
            required
            id="email"
            name="email"
            placeholder="Enter Email/Username"
            style={{ width: "30em" }}
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="mt-1 text-sm text-danger">
              {formik.errors.email}
            </div>
          )}
        </div>
        <div className="row">
          {/* <label className="col-6">Enter Password: </label> */}
          <input
            className="mx-auto"
            type="password"
            required
            name="password"
            id="password"
            placeholder="Enter Password"
            style={{ width: "30em" }}
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="mt-1 text-sm text-danger">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div
          className="mx-auto mt-4"
          style={{ width: "30em" }}
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          //   flexWrap: "wrap",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   marginTop: "2em",
          // }}
        >
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={onChange}
          />
          {formik.touched.captcha && formik.errors.captcha && (
            <div className="mt-1 text-sm text-danger">
              {formik.errors.captcha}
            </div>
          )}
        </div>
        <button
          className="btn btn-warning"
          style={{ marginTop: "2em" }}
          type="submit"
          onClick={formik.handleSubmit}
          disabled={loading}
          loading={loading.toString()}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
