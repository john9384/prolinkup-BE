const Validator = require("validator");
const isEmpty = require("./is-empty");
//const compareTime = require("./compareDateHelper");

const compareTime = (time1, time2) => {
  let arr1 = time1.split("/");
  let arr2 = time2.split("/");

  let date1 = new Date(time1).getTime();
  let date2 = new Date(time2).getTime();

  return date1 > date2;
};

exports.validateUserSignUp = async (body) => {
  let error = {
    state: false,
    field: "",
    detail: "",
  };
  const nameRegex = new RegExp("");
  const textareaRegex = new RegExp("");
  const phoneRegex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
  let passwordRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  const { firstname, lastname, email, phone, password, confirm_password } =
    body;
  if (isEmpty(firstname)) {
    return (error = {
      field: "firstname",
      detail: "Firstname field cannot be empty",
      state: true,
    });
  }
  if (!Validator.isAlpha(firstname)) {
    return (error = {
      field: "firstname",
      detail: "Firstname should include alphabet only",
      state: true,
    });
  }
  if (isEmpty(lastname)) {
    return (error = {
      field: "lastname",
      detail: "Lastname field cannot be empty",
      state: true,
    });
  }
  if (!Validator.isAlpha(lastname)) {
    return (error = {
      field: "lastname",
      detail: "Lastname should include alphabet only",
      state: true,
    });
  }
  if (isEmpty(email)) {
    return (error = {
      field: "email",
      detail: "Email field cannot be empty",
      state: true,
    });
  }
  if (!Validator.isEmail(email)) {
    return (error = {
      field: "email",
      detail: "Email not a valid email address",
      state: true,
    });
  }
  if (isEmpty(phone)) {
    return (error = {
      field: "phone",
      detail: "Phone number field cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(phone, phoneRegex)) {
    return (error = {
      field: "phone",
      detail: "Phone number is not a valid phone number",
      state: true,
    });
  }
  if (isEmpty(password)) {
    return (error = {
      field: "password",
      detail: "A password is required",
      state: true,
    });
  }
  if (!Validator.matches(password, passwordRegex)) {
    return (error = {
      field: "password",
      detail:
        "Password must contain a number, uppercase, and not less than 8 character",
      state: true,
    });
  }
  if (isEmpty(password)) {
    return (error = {
      field: "password2",
      detail: "Confirm the password inputed",
      state: true,
    });
  }
  if (password !== confirm_password) {
    return (error = {
      field: "password2",
      detail: "Password does not match",
      state: true,
    });
  }
  return error;
};
exports.validateUserLogin = async (body) => {
  const { email, password } = body;
  let error = {
    state: false,
  };
  let passwordRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  if (isEmpty(email)) {
    return (error = {
      field: "email",
      detail: "Email field cannot be empty",
      state: true,
    });
  }
  if (!Validator.isEmail(email)) {
    if (!Validator.matches(password, passwordRegex)) {
      return (error = {
        field: "password",
        detail: "Password is incorrect",
        state: true,
      });
    }
    return (error = {
      field: "email",
      detail: "Email does not exist",
      state: true,
    });
  }
  if (isEmpty(password)) {
    return (error = {
      field: "password",
      detail: "Input your password",
      state: true,
    });
  }

  return error;
};

exports.validateProfileInput = async (body) => {
  const {
    handle,
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = body;
  let error = {
    state: false,
  };
  // const companyRegex = new RegExp("^[a-z A-Z 0-9,_.+&#'~;-!]");
  const nameRegex = new RegExp("^[a-z,.'-]+$");
  const urlRegex = new RegExp(
    "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
  );
  const usernameRegex = new RegExp("^[a-zA-Z0-9-_]+$");
  const skillsRegex = new RegExp("([^,]+)");
  if (isEmpty(handle)) {
    return (error = {
      field: "handle",
      detail: "Handle cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(handle, usernameRegex)) {
    return (error = {
      field: " handle",
      detail:
        "Handle can include alphabets, numbers and '-', '_' characters only",
      state: true,
    });
  }

  // if (!isEmpty(company) && !Validator.matches(company, nameRegex)) {
  //   return (error = {
  //     field: "company",
  //     detail: "Invalid name format",
  //     state: true
  //   });
  // }
  if (!isEmpty(website) && !Validator.matches(website, urlRegex)) {
    return (error = {
      field: "website",
      detail: "Inputed website is an invalid URL",
      state: true,
    });
  }
  // if (!isEmpty(status) && !Validator.matches(status, nameRegex)) {
  //   return (error = {
  //     field: "status",
  //     detail: "Invalid text format",
  //     state: true
  //   });
  // }
  // if (!isEmpty(location) && !Validator.matches(location, nameRegex)) {
  //   return (error = {
  //     field: "location",
  //     detail: "Location must include alphabet only",
  //     state: true
  //   });
  // }
  if (bio.length > 200) {
    return (error = {
      field: "bio",
      detail: "Maximum of 200 characters",
      state: true,
    });
  }
  if (
    !isEmpty(githubusername) &&
    !Validator.matches(githubusername, usernameRegex)
  ) {
    return (error = {
      field: "githubusername",
      detail: "Github username is invalid",
      state: true,
    });
  }
  if (!isEmpty(skills) && !Validator.matches(skills, skillsRegex)) {
    return (error = {
      field: "skills",
      detail: "Skill should be seperated with commas",
      state: true,
    });
  }
  if (
    isEmpty(company) ||
    isEmpty(website) ||
    isEmpty(location) ||
    isEmpty(status) ||
    isEmpty(skills) ||
    isEmpty(bio) ||
    isEmpty(githubusername) ||
    isEmpty(youtube) ||
    isEmpty(twitter) ||
    isEmpty(facebook) ||
    isEmpty(linkedin) ||
    isEmpty(instagram)
  ) {
    return (error = {
      state: false,
    });
  }
  if (!Validator.isURL(youtube)) {
    return (error = {
      field: "youtube",
      detail: "Inputed link is an invalid URL",
      state: true,
    });
  }
  if (!Validator.isURL(twitter)) {
    return (error = {
      field: "twitter",
      detail: "Inputed link is an invalid URL",
      state: true,
    });
  }
  if (!Validator.isURL(facebook)) {
    return (error = {
      field: "facebook",
      detail: "Inputed link is an invalid URL",
      state: true,
    });
  }
  if (!Validator.isURL(linkedin)) {
    return (error = {
      field: "linkedin",
      detail: "Inputed link is an invalid URL",
      state: true,
    });
  }
  if (!Validator.isURL(instagram)) {
    return (error = {
      field: "instagram",
      detail: "Inputed link is an invalid URL",
      state: true,
    });
  }

  return error;
};

exports.validateUserExp = async (body) => {
  const { title, company, location, from, to, current, description } = body;
  let error = {
    state: false,
  };
  const nameRegex = "^[a-zA-Z][a-zA-Z\\s]+$";
  // const dateRegex = new RegExp("^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$");
   if (isEmpty(company)) {
     return (error = {
       field: "company",
       detail: "Company cannot be empty",
       state: true,
     });
   }
   if (!Validator.matches(company, nameRegex)) {
     return (error = {
       field: "company",
       detail: "Company must include alphabet only",
       state: true,
     });
   }
  if (isEmpty(title)) {
    return (error = {
      field: "title",
      detail: "Title cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(title, nameRegex)) {
    return (error = {
      field: "title",
      detail: "Title can only include alphabets",
      state: true,
    });
  }
 
  if (Validator.isEmpty(location)) {
    return (error = {
      field: "location",
      detail: "Location cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(location, nameRegex)) {
    return (error = {
      field: "location",
      detail: "Location must include alphabet only",
      state: true,
    });
  }
  if (isEmpty(from)) {
    return (error = {
      field: "from",
      detail: "Start date cannot be empty",
      state: true,
    });
  }
  // if (!Validator.matches(from, dateRegex)) {
  //   return (error = {
  //     field: "from",
  //     detail: "Invalid date format. Use format MM/DD/YYYY",
  //     state: true
  //   });
  // }
  if (isEmpty(to)) {
    return (error = {
      state: false,
    });
  }
  // if (!Validator.matches(to, dateRegex)) {
  //   return (error = {
  //     field: "to",
  //     detail: "Invalid date format. Use format MM/DD/YYYY",
  //     state: true
  //   });
  // }
  if (!compareTime(to, from)) {
    return (error = {
      field: "to",
      detail: "End date cannot be before start date",
      state: true,
    });
  }
  if (isEmpty(current)) {
    return (error = {
      state: false,
    });
  }
  if (!Validator.isBoolean(current)) {
    return (error = {
      field: "current",
      detail: "Value should be boolean",
      state: true,
    });
  }
  if (isEmpty(description)) {
    return (error = {
      state: false,
    });
  }
  if (description.length > 200) {
    return (error = {
      field: "description",
      detail: "Should not be more than 200 characters",
      state: true,
    });
  }
  return error;
};

exports.validateUserEdu = async (body) => {
  const { school, degree, fieldofstudy, from, to, current, description } = body;
  console.log(typeof body.from);
  let error = {
    state: false,
  };
  const nameRegex = "^[a-zA-Z][a-zA-Z\\s]+$";
  // const dateRegex = new RegExp(
  //   "^[0-9][0-9][/][0-9][0-9][/][0-9][0-9][0-9][0-9]$"
  // );

  if (isEmpty(school)) {
    return (error = {
      field: "school",
      detail: "school cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(school, nameRegex)) {
    return (error = {
      field: "school",
      detail: "school can only include alphabets",
      state: true,
    });
  }
  if (isEmpty(degree)) {
    return (error = {
      field: "degree",
      detail: "degree cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(degree, nameRegex)) {
    return (error = {
      field: "degree",
      detail: "degree must include alphabet only",
      state: true,
    });
  }
  if (isEmpty(fieldofstudy)) {
    return (error = {
      field: "fieldofstudy",
      detail: "field of study cannot be empty",
      state: true,
    });
  }
  if (!Validator.matches(fieldofstudy, nameRegex)) {
    return (error = {
      field: "fieldofstudy",
      detail: "field of study must include alphabet only",
      state: true,
    });
  }
  if (isEmpty(from)) {
    return (error = {
      field: "from",
      detail: "Start date cannot be empty",
      state: true,
    });
  }
  // if (!Validator.matches(from, dateRegex)) {
  //   return (error = {
  //     field: "from",
  //     detail: "Invalid date format. Use format MM/DD/YYYY",
  //     state: true
  //   });
  // }
  if (isEmpty(to)) {
    return (error = {
      state: false,
    });
  }
  // if (!Validator.matches(to, dateRegex)) {
  //   return (error = {
  //     field: "to",
  //     detail: "Invalid date format. Use format MM/DD/YYYY",
  //     state: true
  //   });
  // }
  if (!compareTime(to, from)) {
    return (error = {
      field: "to",
      detail: "End date cannot be before start date",
      state: true,
    });
  }
  if (isEmpty(current)) {
    return (error = {
      state: false,
    });
  }
  if (!Validator.isBoolean(current)) {
    return (error = {
      field: "current",
      detail: "Value should be boolean",
      state: true,
    });
  }
  if (isEmpty(description)) {
    return (error = {
      state: false,
    });
  }
  if (description.length > 200) {
    return (error = {
      field: "description",
      detail: "Should not be more than 200 characters",
      state: true,
    });
  }
  return error;
};
