import React, { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ERROR_MESSAGE, API_ROUTE, API_URL, SUCCESS_MSG } from "../constants";

function Register() {
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const inputElement = createRef();

  const getUser = async () => {
    const res = await axios.get(`${API_URL}/${API_ROUTE.user}`);
    setUsers(...users, res.data);
  };
  useEffect(() => {
    inputElement?.current?.focus();
    getUser();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    history("/dashboard");
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    history("/login");
  };

  async function createUser(payload) {
    setLoading(true);
    console.log(payload);
    try {
      const response = await axios.post(
        `${API_URL}/${API_ROUTE.user}`,
        payload
      );
      if (response) {
        setLoading(false);
        history("/login");
        // message.success(SUCCESS_MSG.userCreate);
      }
    } catch (error) {
      setLoading(false);
      // message.error(ERROR_MESSAGE.somethingWentWrong);
      console.error(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      email: "",
      contact: "",
      password: "",
      profile: "",
    },

    validationSchema: Yup.object().shape({
      userName: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, ERROR_MESSAGE.spaceValidation)
        .required(ERROR_MESSAGE.userName)
        .test("unique", ERROR_MESSAGE.userNameExist, async (list) => {
          return !Boolean(users.find((elem) => elem.userName === list));
        }),
      fullName: Yup.string().required(ERROR_MESSAGE.fullName),
      contact: Yup.string()
        .min(10, ERROR_MESSAGE.contacMinTen)
        .max(10, ERROR_MESSAGE.contacMinTen)
        .matches(/^[a-zA-Z0-9]*$/, ERROR_MESSAGE.spaceValidation)
        .test("unique", ERROR_MESSAGE.contactExist, async (list) => {
          return !Boolean(users.find((elem) => elem.contact === list));
        }),
      email: Yup.string()
        .required(ERROR_MESSAGE.emailRequired)
        .email(ERROR_MESSAGE.email)
        .test("unique", ERROR_MESSAGE.emailExist, async (list) => {
          return !Boolean(users.find((elem) => elem.email === list));
        }),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
          ERROR_MESSAGE.passwordValidation
        )
        .required(ERROR_MESSAGE.passRequired)
        .min(6, ERROR_MESSAGE.passwordMinSix),
      // confirmPassword: Yup.string()
      //   .when("password", {
      //     is: (val) => (val && val.length > 0 ? true : false),
      //     then: Yup.string().oneOf(
      //       [Yup.ref("password")],
      //       ERROR_MESSAGE.passwordNotMatch
      //     ),
      //   })
      //   .required(ERROR_MESSAGE.confirmPassRequired),
    }),

    onSubmit: (values) => {
      submitData(values);
    },
  });

  const submitData = async (data) => {
    const payload = {
      id: Math.floor(Math.random() * 1000),
      contact: data.contact,
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      profile: data.profile || "",
      userName: data.userName,
    };

    createUser(payload);
  };

  return (
    <div className="container mt-4">
      <h2>Sign up</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          {/* <label className="col-6">Enter Name: </label> */}
          <input
            ref={inputElement}
            className="mx-auto"
            type="text"
            id="fullName"
            name="fullName"
            required
            placeholder="Enter Full Name"
            {...formik.getFieldProps("fullName")}
            style={{ width: "30em" }}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="text-danger">{formik.errors.fullName}</div>
          )}
        </div>
        <div className="row">
          {/* <label className="col-6">Enter Username: </label> */}
          <input
            className="mx-auto"
            type="text"
            id="userName"
            name="userName"
            required
            placeholder="Enter Username"
            {...formik.getFieldProps("userName")}
            style={{ width: "30em" }}
          />
          {formik.touched.userName && formik.errors.userName && (
            <div className="text-danger">{formik.errors.userName}</div>
          )}
        </div>
        <div className="row">
          {/* <label className="col-6">Enter Contact Number: </label> */}
          <input
            className="mx-auto"
            type="tel"
            id="contact"
            name="contact"
            placeholder="Enter Contact Number"
            {...formik.getFieldProps("contact")}
            style={{ width: "30em" }}
          />
          {formik.touched.contact && formik.errors.contact && (
            <div className="text-danger">{formik.errors.contact}</div>
          )}
        </div>
        <div className="row">
          {/* <label className="col-6">Enter Email: </label> */}
          <input
            className="mx-auto"
            type="email"
            id="emal"
            name="email"
            required
            placeholder="Enter Email"
            {...formik.getFieldProps("email")}
            style={{ width: "30em" }}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>
        <div className="row">
          {/* <label className="col-6">Enter password: </label> */}
          <input
            className="mx-auto"
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter Password"
            {...formik.getFieldProps("password")}
            style={{ width: "30em" }}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger">{formik.errors.password}</div>
          )}
        </div>
        <button className="btn btn-primary mt-3" type="submit">
          Register
        </button>
      </form>
      <div className="mt-4">
        <span>
          Already a user?
          <button className="btn btn-warning" onClick={handleSignIn}>
            Sign In
          </button>
        </span>
      </div>
    </div>
  );
}

export default Register;
