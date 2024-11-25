export default function CardWithoutImage() {
  return (
    <div className='flex cursor-pointer items-center justify-between hover:underline'>
      <span className='truncate text-left text-sm text-juga-grayscale-black'>
        [단독] 반도체 산업 신규 투자 확대...정부 지원책 발표
      </span>
      <span className='whitespace-nowrap text-right text-xs text-juga-grayscale-500'>
        중앙일보
      </span>
    </div>
  );
}
