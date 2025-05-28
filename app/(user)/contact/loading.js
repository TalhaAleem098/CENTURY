import React from "react";
import { Atom, OrbitProgress } from "react-loading-indicators";
const loading = () => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <Atom color="#0000" size="medium" text="Please Wait..." textColor="#0000" />
      </div>
    </div>
  );
};

export default loading;
