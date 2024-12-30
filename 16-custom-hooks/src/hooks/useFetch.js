import { useEffect, useState } from "react";
// functions starting with use are treated as hooks
// rules of hooks are enfored on such functions
export function useFetch(fetchFn, initialValue) {
  // useFetch should manage all the related states
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  // inside hook, we can use other hook
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch data." });
      }

      setIsFetching(false);
    }

    fetchData();
  }, [fetchFn]);
  // return state values so that the component that will use this custom hook can use them
  return {
    isFetching,
    fetchedData,
    setFetchedData,
    error,
  };
}
