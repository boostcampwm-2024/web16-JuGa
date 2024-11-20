import { FallbackProps } from 'react-error-boundary';

export default function FallbackUI({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
