import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import blankprofile from "@/assets/blankprofile.webp";
import validator from "validator";
import { HOST, SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api-client";
import { useStore } from "../../../store/index.js";

const Auth = () => {
  const [Login, useLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [showError, setShowError] = useState({});
  const [errors, setErrors] = useState({}); // false -> no error and true -> error
  const navigate = useNavigate();

  const setFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size < 5 * 1024 * 1024
      ) {
        setImage(file);
      }
    }
  };

  const { setUserInfo } = useStore();

  const handlelogin = async (e) => {
    e.preventDefault();

    const emailError = !validator.isEmail(email);
    const passwordError = password.length === 0; // ✅ changed

    setShowError({ email: true, password: true });
    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      try {
        const res = await api.post(`${HOST}${LOGIN_ROUTE}`, {
          email,
          password,
        });
        if (res.data.success) {
          setUserInfo(res.data.data);
          navigate("/");
        }
      } catch (err) {
        if (!err.response) {
          navigate('/coldstart')
        }
        alert(err?.response?.data?.message || "internal server error");
      }
    }
  };

  const handlesignup = async (e) => {
    e.preventDefault();

    const usernameError = !validator.isAlphanumeric(username);
    const emailError = !validator.isEmail(email);
    const passwordError = !validator.isStrongPassword(password);

    setShowError({ username: true, email: true, password: true });
    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
    });

    if (!usernameError && !emailError && !passwordError) {
      try {
        const res = await api.post(`${HOST}${SIGNUP_ROUTE}`, {
          username,
          password,
          email,
        });

        if (res.data.success) {
          setUserInfo(res.data.data);
          navigate("/");
        }
      } catch (err) {
        if (!err.response) {
          navigate('/coldstart')
        }
        alert(err?.response?.data?.message || "internal server error");
      }
    }
  };

  return (
    <div className=" h-screen w-screen flex items-center">
      <div className=" shadow-sm shadow-black   rounded-2xl  mx-auto  w-[90%] lg:px-[1%] px-[4%] h-auto py-4 lg:w-1/4 flex flex-col gap-10">
        {Login ? (
          <form onSubmit={handlelogin}>
            <div className="w-full flex flex-col gap-7">
              <Field data-invalid={showError.email && errors.email}>
                <Input
                  placeholder={"Enter email-id"}
                  type={"email"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowError((obj) => ({ ...obj, email: false }));
                  }}
                  required
                />
                {showError.email && errors.email == true && (
                  <FieldError className={"ms-2"}>
                    Enter a valid email address.
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={showError.password && errors.password}>
                <Input
                  placeholder={"Enter password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowError((obj) => ({ ...obj, password: false }));
                  }}
                  type={"password"}
                  required
                />
                {showError.password && errors.password && (
                  <FieldError className={"ms-2"}>
                    Enter a valid strong password.
                  </FieldError>
                )}
              </Field>

              <Button className={"w-1/2 mx-auto mt-4"} type={"submit"}>
                Log in
              </Button>
            </div>
          </form>
        ) : (
          <form className="h-4/5" onSubmit={handlesignup}>
            <div className="w-full min-h-1/3 flex flex-col gap-3  ">
              <Field className={" h-full  "}>
                <FieldLabel
                  htmlFor="input-profile-photo"
                  className={"h-full  "}
                >
                  <img
                    className=" h-28 w-28 object-cover  mx-auto rounded-[50%]"
                    src={(image && URL.createObjectURL(image)) || blankprofile}
                  />
                </FieldLabel>
                <Input
                  type={"file"}
                  id={"input-profile-photo"}
                  accept={".jpg, .jpeg, .png"}
                  onChange={setFile}
                  className={"hidden"}
                />
              </Field>
              <Field data-invalid={showError.username && errors.username}>
                <Input
                  placeholder={"Enter username"}
                  type={"text"}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setShowError((obj) => ({ ...obj, username: false }));
                  }}
                  required
                />
                {showError.username && errors.username && (
                  <FieldError className={"ms-2"}>
                    Enter a valid username
                  </FieldError>
                )}
              </Field>
              <Field data-invalid={showError.email && errors.email}>
                <Input
                  placeholder={"Enter email-id"}
                  type={"email"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowError((obj) => ({ ...obj, email: false }));
                  }}
                  value={email}
                  required
                />
                {showError.email && errors.email && (
                  <FieldError className={"ms-2"}>
                    Enter a valid email address.
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={showError.password && errors.password}>
                <Input
                  placeholder={"Enter password"}
                  type={"password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowError((obj) => ({ ...obj, password: false }));
                  }}
                  required
                />
                {showError.password && errors.password && (
                  <FieldError className={"ms-2"}>
                    Enter a valid strong password.
                  </FieldError>
                )}
              </Field>
              <Button className={"w-1/2 mx-auto mt-5"} type={"submit"}>
                Sign up
              </Button>
            </div>
          </form>
        )}

        <Button
          onClick={() => useLogin(!Login)}
          children={Login ? "Register as a new user" : "Login"}
          className={"bg-blue-400 hover:bg-blue-600 mx-auto w-full "}
        />
      </div>
    </div>
  );
};

export default Auth;
