import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      defaultValue={value}
      onChange={onChange}
      placeholder="Search notes"
    />
  );
};

export default SearchBox;
