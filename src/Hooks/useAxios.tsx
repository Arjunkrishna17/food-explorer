import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { BASE_URL } from "../Utils/ApiEndpoints";

const useAxios = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      throw error;
    }
  );

  const handleError = (error: any, needToast = true) => {
    let errorMessage;

    if (error.response?.data?.error) {
      setErrorMsg(error.response.data.error);

      errorMessage = error.response.data.error;
    } else {
      setErrorMsg("Something went wrong, please try again later");
      console.error(error.message);
      errorMessage = error.message;
    }

    console.log({ error, errorMessage });

    if (needToast) {
      toast.error(errorMessage);
    }
  };

  return {
    axiosInstance,
    handleError,
    errorMsg,
    setErrorMsg,
    isLoading,
    setIsLoading,
  };
};

export default useAxios;
