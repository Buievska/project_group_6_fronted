import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  text: string;
}

export default function ErrorMessage({ text }: ErrorMessageProps) {
  return <p className={css.text}>{text}</p>;
}
