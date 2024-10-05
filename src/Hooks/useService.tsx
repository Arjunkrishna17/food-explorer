import useAxios from "./useAxios";

const useService = () => {
  const { axiosInstance } = useAxios();

  const getCategories = async () => {
    const response = await axiosInstance.get("/categories.php");
    return response.data.categories;
  };

  const getMealsByCategory = async (category: string) => {
    const response = await axiosInstance.get(`/filter.php?c=${category}`);
    return response.data.meals;
  };

  const getMealsByIngredient = async (ingredient: string) => {
    const response = await axiosInstance.get(`/filter.php?i=${ingredient}`);
    return response.data.meals;
  };

  const getMealDetails = async (mealName: string) => {
    const response = await axiosInstance.get(`/search.php?s=${mealName}`);
    return response.data.meals[0];
  };

  return {
    getCategories,
    getMealsByCategory,
    getMealDetails,
    getMealsByIngredient,
  };
};

export default useService;
