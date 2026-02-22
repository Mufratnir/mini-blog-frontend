
import { fetchCategories, addCategory, updateCategory, deleteCategory } from './api';
import { useUI } from './UIContext'; 

export const useApi = () => {
  
  const { setLoader, setAlert } = useUI();

  return {
    fetchCategories: () => fetchCategories({ setLoader, setAlert }),
    addCategory: (data: any) => addCategory(data, { setLoader, setAlert }),
    updateCategory: (id: string | number, data: any) =>
      updateCategory(id, data, { setLoader, setAlert }),
    deleteCategory: (id: string | number) => deleteCategory(id, { setLoader, setAlert }),
  };
};
