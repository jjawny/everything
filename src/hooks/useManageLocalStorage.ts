import { ShortFormModel } from "@/models/ShortFormModel";
import { useEffect, useState } from "react";

const useManageLocalStorage = <T>(key: string, fallbackInitialData: T) => {
  const [initialData, setInitialData] = useState<T>(fallbackInitialData);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(true);

  const clearData = () => localStorage.removeItem(key);
  const saveData = (form: ShortFormModel) => localStorage.setItem(key, JSON.stringify(form));

  useEffect(
    function loadInitialForm() {
      try {
        const preSavedData = localStorage.getItem(key);
        if (preSavedData) {
          console.log(`Loaded pre-saved form data from LocalStorage:`, preSavedData);
          setInitialData(JSON.parse(preSavedData));
        }
      } catch (err) {
        console.warn(`Error loading pre-saved form data from LocalStorage:`, err);
        clearData();
      } finally {
        setIsLoadingInitialData(false);
      }
    },
    [key]
  );

  return { initialData, isLoadingInitialData, clearData, saveData };
};

export default useManageLocalStorage;
