import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, HelperText, Input, Label } from "windmill-react-ui";
import { AuthContext } from "../context/AuthContext";
import { careLogin, getCurrentUser } from "../utils/api";

function Login() {
  const { register, handleSubmit, setError, errors } = useForm();
  const { login } = useContext(AuthContext);
  let history = useHistory();
  const onSubmit = (data) => {
    careLogin(data)
      .then((lresp) => {
        getCurrentUser(lresp.access)
          .then((uresp) => {
            login(lresp.access, lresp.refresh, uresp);
            history.replace("/app/distdashboard");
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((ex) => {
        setError("login", ex);
      });
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:p-10">
        <main className="flex items-center justify-center ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Login with Care Credentials
            </h1>
            <Label>
              <span>Username</span>
              <Input
                name="username"
                ref={register({ required: true })}
                className="mt-1 "
                placeholder="johsn@doe.com"
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
            <Button className="mt-4 " block type="submit">
              Log in
            </Button>
            {errors.login && (
              <HelperText valid={false}>Invalid Credentials</HelperText>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

export default Login;
