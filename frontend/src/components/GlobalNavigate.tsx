import React from "react";
import { ReactNode } from "react";
import globalNavigate from "../app/globalNavigate";
import { useNavigate } from "react-router";
import { useEffect } from "react";

//Global navigation rapper to allow axios and other auxillary functions to rout using react router
interface GlobalNavigateProps {
  children: ReactNode;
}

const GlobalNavigate = ({ children }: GlobalNavigateProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    globalNavigate.navigate = navigate;
  }, [navigate]);

  return <>{children}</>;
};

export default GlobalNavigate;
