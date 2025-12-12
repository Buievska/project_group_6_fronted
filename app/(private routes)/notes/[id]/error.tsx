"use client";

type ErrorProps = {
  error: Error;
};

const ErrorMessageId = ({ error }: ErrorProps) => {
  return <p>Could not fetch note details. {error.message}</p>;
};

export default ErrorMessageId;
