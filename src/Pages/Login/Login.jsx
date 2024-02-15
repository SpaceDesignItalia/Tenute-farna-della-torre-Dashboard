import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import bg from "../../assets/bg.jpg";
import Logo from "../../assets/logo.png";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import { API_URL } from "../../API/API";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  function handleSubmit() {
    axios
      .post(API_URL + "/Staffer/Login", loginData, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          location.reload();
        }
      });
  }

  function handleEmailChange(e) {
    setLoginData({ ...loginData, email: e.target.value });
  }

  function handlePasswordChange(e) {
    setLoginData({ ...loginData, password: e.target.value });
  }
  return (
    <div className="h-screen flex min-h-full flex-1">
      <div className="w-1/2 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col justify-center items-center">
            <img className="h-52 w-auto" src={Logo} alt="Your Company" />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Accedi al pannello amministrativo
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <Input
                      variant="bordered"
                      size="sm"
                      radius="sm"
                      placeholder="Email"
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <Input
                      label="Password"
                      variant="bordered"
                      placeholder="Enter your password"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <RemoveRedEyeOutlinedIcon />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div>
                  <Button
                    onClick={handleSubmit}
                    color="primary"
                    radius="sm"
                    fullWidth
                  >
                    Accedi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bg}
          alt=""
        />
      </div>
    </div>
  );
}
