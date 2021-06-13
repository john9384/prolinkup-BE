let arr = [
  {
    name: "Sign Up User",
    component: "user",

    route: "/user/sign-up",
    authRequired: false,
    method: "userController.postSignup",
    returns: "User Object",
    isFinished: true,
  },
  {
    name: "Login User",
    component: "user",
    route: "/user/authenticate",
    authRequired: false,
    method: "userController.postSignup",
    returns: "Token Object",
    isFinished: true,
  },
];

console.table(arr);
