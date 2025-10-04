import { useState } from "react";
import { useFetch } from "./useFetch";

export const useRecipeSearch = (initialSearchType = "recipe", limit = 6) => {
  const [searchType, setSearchType] = useState(initialSearchType);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTermForFetch, setSearchTermForFetch] = useState("");
  const url = `/api/recipes/search?searchType=${searchType}&searchTerm=${searchTermForFetch}&page=${currentPage}&limit=${limit}`;
  const { data, loading, error, refetch } = useFetch(url);

  const handleFilter = () => {
    setSearchTermForFetch(searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchTermForFetch("");
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  return {
    recipes: data?.data?.recipes,
    totalPages: data?.data?.totalPages,
    loading,
    error,

    searchType,
    searchTerm,
    currentPage,

    setSearchType,
    setSearchTerm,

    handleFilter,
    clearFilters,
    nextPage,
    prevPage,
  };
};
