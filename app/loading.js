import React from "react";
import { OrbitProgress } from "react-loading-indicators";
const loading = () => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
      </div>
    </div>
  );
};

export default loading;
