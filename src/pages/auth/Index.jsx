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
          navigate("/coldstart");
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
          username: username.replace(/\s/g, ""),
          password,
          email,
        });

        if (res.data.success) {
          setUserInfo(res.data.data);
          navigate("/");
        }
      } catch (err) {
        if (!err.response) {
          navigate("/coldstart");
        }
        alert(err?.response?.data?.message || "internal server error");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center px-4 py-8
    bg-linear-to-br from-[#020617] via-[#0f172a] to-[#172554]"
    >
      <div
        className="relative overflow-hidden border border-white/10
      bg-white/6 backdrop-blur-2xl shadow-2xl shadow-black/30
      rounded-3xl mx-auto w-full max-w-md lg:w-1/4
      px-6 sm:px-8 py-8 flex flex-col gap-8"
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-20 -right-20 h-48 w-48
        rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {Login ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {Login
              ? "Sign in to continue your journey."
              : "Join us and get started today."}
          </p>
        </div>

        {Login ? (
          <form onSubmit={handlelogin} className="relative z-10">
            <div className="w-full flex flex-col gap-5">
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
                  className="h-12 rounded-xl border border-white/10
                  bg-slate-950/40 px-4 text-white placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-blue-500/70
                  focus-visible:border-blue-500/50 transition-all"
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
                  className="h-12 rounded-xl border border-white/10
                  bg-slate-950/40 px-4 text-white placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-blue-500/70
                  focus-visible:border-blue-500/50 transition-all"
                />
                {showError.password && errors.password && (
                  <FieldError className={"ms-2"}>
                    Enter a valid strong password.
                  </FieldError>
                )}
              </Field>

              <Button
                className="w-full h-12 mt-2 rounded-xl font-semibold text-white
                bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20
                hover:shadow-blue-500/30 hover:-translate-y-0.5
                transition-all duration-200"
                type={"submit"}
              >
                Log in
              </Button>
            </div>
          </form>
        ) : (
          <form className="relative z-10" onSubmit={handlesignup}>
            <div className="w-full flex flex-col gap-4">
              {/* <Field className={"flex items-center justify-center"}>
              <FieldLabel
                htmlFor="input-profile-photo"
                className="group cursor-pointer"
              >
                <div className="relative p-1 rounded-full
                  bg-linear-to-br from-blue-400 to-indigo-600
                  shadow-lg shadow-blue-500/20">
                  <img
                    className="h-24 w-24 rounded-full object-cover
                      border-4 border-slate-900 transition-transform
                      duration-200 group-hover:scale-105"
                    src={(image && URL.createObjectURL(image)) || blankprofile}
                  />
                  <span className="absolute bottom-0 right-0 flex h-8 w-8
                    items-center justify-center rounded-full border-2
                    border-slate-900 bg-blue-500 text-white text-lg">
                    +
                  </span>
                </div>
                <p className="mt-2 text-center text-xs text-slate-400">
                  Add profile photo
                </p>
              </FieldLabel>

              <Input
                type={"file"}
                id={"input-profile-photo"}
                accept={".jpg, .jpeg, .png"}
                onChange={setFile}
                className={"hidden"}
              />
            </Field> */}

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
                  className="h-11 rounded-xl border border-white/10
                  bg-slate-950/40 px-4 text-white placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-blue-500/70
                  focus-visible:border-blue-500/50 transition-all"
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
                  className="h-11 rounded-xl border border-white/10
                  bg-slate-950/40 px-4 text-white placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-blue-500/70
                  focus-visible:border-blue-500/50 transition-all"
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
                  className="h-11 rounded-xl border border-white/10
                  bg-slate-950/40 px-4 text-white placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-blue-500/70
                  focus-visible:border-blue-500/50 transition-all"
                />
                {showError.password && errors.password && (
                  <FieldError className={"ms-2"}>
                    Enter a valid strong password.
                  </FieldError>
                )}
              </Field>

              <Button
                className="w-full h-12 mt-2 rounded-xl font-semibold text-white
                bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20
                hover:shadow-blue-500/30 hover:-translate-y-0.5
                transition-all duration-200"
                type={"submit"}
              >
                Sign up
              </Button>
            </div>
          </form>
        )}

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button
          onClick={() => useLogin(!Login)}
          children={Login ? "Create a new account" : "Back to login"}
          className="relative z-10 w-full h-11 mx-auto rounded-xl
          border border-white/10 bg-white/5 hover:bg-white/10
          text-slate-200 hover:text-white font-medium
          transition-all duration-200"
        />
      </div>
    </div>
  );
};
export default Auth;
