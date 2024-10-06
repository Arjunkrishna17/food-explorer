import useAxios from "./useAxios";

const useService = () => {
  const { axiosInstance, handleError } = useAxios();

  const getCategories = async () => {
    let result;

    try {
      const response = await axiosInstance.get("/categories.php");
      result = response.data.categories;
    } catch (error) {
      handleError(error);
    }

    return result;
  };

  const getMealsByCategory = async (category: string) => {
    let result;

    try {
      const response = await axiosInstance.get(`/filter.php?c=${category}`);
      result = response.data.meals;
    } catch (error) {
      handleError(error);
    }

    return result;
  };

  const getMealsByIngredient = async (ingredient: string) => {
    let result;

    try {
      const response = await axiosInstance.get(`/filter.php?i=${ingredient}`);
      result = response.data.meals;
    } catch (error) {
      handleError(error);
    }

    return result;
  };

  const getMealDetails = async (mealName: string) => {
    let result;

    try {
      const response = await axiosInstance.get(`/search.php?s=${mealName}`);
      result = response.data.meals[0];
    } catch (error) {
      handleError(error);
    }

    return result;
  };

  return {
    getCategories,
    getMealsByCategory,
    getMealDetails,
    getMealsByIngredient,
  };
};

export default useService;
