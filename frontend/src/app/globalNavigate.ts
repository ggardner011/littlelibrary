import { NavigateFunction } from "react-router-dom";

//Create global router to allow axios to access the useNaviagte hook set in app.js
const globalNavigate = { navigate: null } as {
  navigate: null | NavigateFunction;
};

export default globalNavigate;
