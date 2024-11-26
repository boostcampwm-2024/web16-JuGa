export default function MyInfo() {
  return (
    <div className='flex flex-col items-center p-6 text-lg'>
      <div className='w-full px-40'>
        <div className='flex items-center justify-between py-2 border-b'>
          <p className='font-medium text-left text-jugagrayscale-400 w-28'>
            Username
          </p>
          <p className='font-semibold text-jugagrayscale-500'>dongree</p>
        </div>
        <div className='flex items-center justify-between py-2'>
          <p className='font-medium text-left text-jugagrayscale-400 w-28'>
            Email
          </p>
          <p className='font-semibold text-jugagrayscale-500'>abc123@abc.com</p>
        </div>
      </div>
    </div>
  );
}
