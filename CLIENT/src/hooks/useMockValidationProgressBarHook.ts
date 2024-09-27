import { useEffect, useRef, useState } from "react";

const useMockValidationProgressBarHook = (email: string, originalEmail: string) => {
  const [isShowValidationProgressBar, setIsShowValidationProgressBar] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const isChanged = email && originalEmail ? email.trim() !== originalEmail.trim() : false;
    if (isChanged) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setIsShowValidationProgressBar(true);

      timeoutRef.current = setTimeout(() => {
        setIsShowValidationProgressBar(false);
      }, 1000);
    }
  }, [email, originalEmail]);

  return { isShowValidationProgressBar };
};

export default useMockValidationProgressBarHook;
