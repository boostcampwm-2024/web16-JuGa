import { HTMLInputTypeAttribute } from 'react';

type LoginInputProps = {
  type: HTMLInputTypeAttribute;
  placeholder: string;
};

export default function Input({ type, placeholder }: LoginInputProps) {
  return (
    <input
      className='px-4 py-2 text-sm border-2 rounded-lg outline-none'
      type={type}
      placeholder={placeholder}
    />
  );
}
