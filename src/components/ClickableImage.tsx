import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ClickableImage({ src, alt, className }: ClickableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        className={className}
        src={src}
        alt={alt}
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(true)}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </>
  );
}
