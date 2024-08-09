import Image from 'next/image';
import errorImage from '@/public/path-to-your-svg.svg'; // Update with your SVG path

const ErrorComponent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Image src={errorImage} alt="Error" width={200} height={200} />
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
};

export default ErrorComponent;
