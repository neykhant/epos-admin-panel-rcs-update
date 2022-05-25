import React, { useState, useEffect } from "react";
import { call } from "services/api";

const useQuery = (method, url) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const mountedRef = React.useRef(true);

  const handleApiCall = async (method, url) => {
    if (!mountedRef.current) return null;
    try {
      const result = await call(method, url);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApiCall(method, url);

    return () => {
      mountedRef.current = false;
    };
  }, [method, url]);

  return { response, error, loading };
};

export default useQuery;
