import React from "react";

export function Photo({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}