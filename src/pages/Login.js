import {
  Button,
  HelperText,
  Input,
  Label,
  WindmillContext,
} from "@saanuregh/react-ui";
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
  const history = useHistory();
  const onSubmit = (data) => {
    setLoading(true);
    careLogin(data)
      .then((lresp) => {
        careGetCurrentUser(lresp.access)
          .then((uresp) => {
            login(lresp.access, lresp.refresh, uresp);
            history.replace("/app/district/capacity");
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        setError("login", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="items-center bg-gray-50 dark:bg-gray-900 flex min-h-screen relative duration-200 transition-colors ease-linear">
      <div className="bottom-0 right-0 p-3 absolute">
        <button
          type="button"
          className="focus:shadow-outline-green rounded-md focus:outline-none p-1 dark:text-gray-200 text-gray-700"
          onClick={toggleMode}
          aria-label="Toggle color mode"
        >
          {mode === "dark" ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      <main className="items-center dark:bg-gray-800 bg-white rounded-lg shadow-xl flex h-auto justify-center mx-auto overflow-hidden p-6 w-auto sm:p-10">
        <form>
          <h1 className="text-xl font-semibold mb-4 dark:text-gray-200 text-gray-700">
            Login with Care Credentials
          </h1>
          <Label>
            <span>Username</span>
            <Input
              name="username"
              ref={register({ required: true })}
              className="mt-1"
              placeholder="johsndoe"
              valid={!errors.username}
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
              valid={!errors.password}
            />
          </Label>
          {errors.password && <HelperText valid={false}>Required</HelperText>}
          <Button
            className="mt-4"
            block
            onClick={(e) => {
              errors.login && clearErrors("login");
              handleSubmit(onSubmit)();
            }}
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              <span>Login</span>
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
