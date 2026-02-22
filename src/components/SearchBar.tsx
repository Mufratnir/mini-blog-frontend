import { TextInput } from 'flowbite-react';
import React from 'react';


type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar = (props: Props) => {
  
  return (
    <div className="mb-4 shadow-md bg-white rounded-xl ">
      <TextInput
        id="Search"
        type="text"
        placeholder="Search..."
        required
        className="form-control form-rounded-xl"
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default SearchBar;
