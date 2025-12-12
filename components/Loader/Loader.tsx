import { ClipLoader } from "react-spinners";
import { useState } from "react";
import type { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = () => {
  const [color] = useState("#ffffff");
  return (
    <>
      <ClipLoader
        color={color}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  );
};

export default Loader;
