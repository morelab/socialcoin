import { SearchIcon } from '@heroicons/react/solid';
import { InputField } from './InputField';

type SearchBarProps = {
  value: string;
  changeHandler?: (event: React.FormEvent<HTMLInputElement>) => void;
  inverse?: boolean;
};

export const SearchBar = ({ value, changeHandler, inverse }: SearchBarProps) => {
  return (
    <InputField
      value={value}
      onChange={changeHandler}
      className={`relative mt-0 ${inverse ? 'pr-11' : 'pl-11'}`}
      wrapperClassName='relative'
    >
      <div className={`absolute inset-y-0 flex items-center ${inverse ? 'right-3' : 'left-3'}`}>
        <SearchIcon className='h-6 w-6 text-gray-600 dark:text-gray-300' />
      </div>
    </InputField>
  );
};