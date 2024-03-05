import { useEffect, useState } from "react";
import api from "../Utils/api";

const useApi = (endpoint = "/", method = "get", params = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: method,
    url: endpoint,
    headers: {
      accept: "application/json",
      contentType: "application/json",
      authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
    },
    params: { ...params },
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.request(options);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useApi;
