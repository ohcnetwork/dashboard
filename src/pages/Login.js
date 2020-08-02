import {
  Button,
  HelperText,
  Input,
  Label,
  WindmillContext,
} from "@windmill/react-ui";
import React, { useContext, useState } from "react";
import { Loader, Moon, Sun } from "react-feather";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { careGetCurrentUser, careLogin } from "../utils/api";

function Login() {
  const { register, handleSubmit, setError, clearErrors, errors } = useForm();
  const { login } = useContext(AuthContext);
  const { mode, toggleMode } = useContext(WindmillContext);
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  const onSubmit = (data) => {
    setLoading(true);
    careLogin(data)
      .then((lresp) => {
        careGetCurrentUser(lresp.access)
          .then((uresp) => {
            login(lresp.access, lresp.refresh, uresp);
            history.replace("/app/district/capacity");
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((ex) => {
        setError("login", ex);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute bottom-0 right-0 p-3">
        <button
          className="p-1 text-gray-700 rounded-md focus:outline-none focus:shadow-outline-purple dark:text-gray-200"
          onClick={toggleMode}
          aria-label="Toggle color mode"
        >
          {mode === "dark" ? (
            <Sun className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
      <main className="flex items-center justify-center w-auto h-auto p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:p-10">
        <form>
          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Login with Care Credentials
          </h1>
          <Label>
            <span>Username</span>
            <Input
              name="username"
              ref={register({ required: true })}
              className="mt-1 "
              placeholder="johsndoe"
              valid={errors.username ? false : true}
            />
          </Label>
          {errors.username && <HelperText valid={false}>Required</HelperText>}
          <Label className="mt-4">
            <span>Password</span>
            <Input
              className="mt-1"
              type="password"
              placeholder="***************"
              name="password"
              ref={register({ required: true })}
              valid={errors.password ? false : true}
            />
          </Label>
          {errors.password && <HelperText valid={false}>Required</HelperText>}
          <Button
            className="mt-4 "
            block
            onClick={(e) => {
              errors.login && clearErrors("login");
              handleSubmit(onSubmit)();
            }}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <span>Login in</span>
            )}
          </Button>
          {errors.login && (
            <HelperText valid={false}>Invalid Credentials</HelperText>
          )}
        </form>
      </main>
    </div>
  );
}

export default Login;
