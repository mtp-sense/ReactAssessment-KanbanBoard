const ERROR_MESSAGE = {
  somethingWentWrong: "Something went wrong",
  InvalidCredential: "Invalid Email/Password",
  loginSuccess: "Login Successfuly!",
  required: "This field is required",
  emailRequired: "Email is required",
  taskRequired: "Task is required",
  deadlineRequired: "Due Date is required",
  priorityRequired: "Priority is required",
  passRequired: "Password is required",
  captchaRequired: "CAPTCHA is required",
  confirmPassRequired: "Confirm Password is required",
  contactReq: "Contact is required",
  userName: "User Name is required",
  fullName: "Fullname is required",
  userNameExist: "Username already exists",
  contactExist: "Contact already exists",
  emailExist: "Email address already exists",
  spaceValidation: "Spaces is not allowed",
  email: "Invalid email address",
  passwordMinSix: "Password must be at least 6 characters",
  contacMinTen: "Contact number must be at least 10 numbers",
  passwordValidation:
    "Contains at least 6 characters, 1 lower case (a-z) & 1 Upper case (A-Z), 1 number (0-9) & one special symbol",
  passwordNotMatch: "Password does not match",
  passwordMatch: "New password and old passwrod must be diffrent",
  minimumThreeCode: "Code must contains more than two characters.",
  minimumThreeChar: "This field must contains more than two characters.",
  phoneLength: "Must be 10 digits",
};
const SUCCESS_MSG = {
  taskCreate: "Task created successfully",
  taskUpdate: "Task updated successfully",
  taskDelete: "Task deleted successfully",
  userCreate: "User created successfully",
};
const REGEX = {
  password:
    "/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{6,}$/",
  onlyDigit: "^[0-9]*$",
};
const TASK_STATUS = ["Backlog", "ToDo", "Ongoing", "Done"];
const TASK_PRIORITY = ["High", "Medium", "Low"];
const TASK_NAME = {
  Backlog: 0,
  ToDo: 1,
  Ongoing: 2,
  Done: 3,
};
const PRIORITY = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const API_URL = "http://localhost:3300";
const API_ROUTE = {
  user: "users",
  tasks: "tasks",
};

module.exports = {
  TASK_STATUS,
  ERROR_MESSAGE,
  SUCCESS_MSG,
  TASK_PRIORITY,
  PRIORITY,
  REGEX,
  API_ROUTE,
  API_URL,
  TASK_NAME,
};
