import { useNavigate } from 'react-router-dom';


///Hook for navigating within axios
export const useNavigateHook = () => {
  const navigate = useNavigate();
  return navigate;
};