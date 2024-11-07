import { ComponentProps } from 'react';

type LoginInputProps = ComponentProps<'input'>;

export default function Input({ ...props }: LoginInputProps) {
  return (
    <input
      className='px-4 py-2 text-sm border-2 rounded-lg outline-none'
      {...props}
    />
  );
}
