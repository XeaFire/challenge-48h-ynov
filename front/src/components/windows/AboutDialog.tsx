import { useState, useRef, useEffect } from 'react';

interface AboutDialogProps {
  onClose: () => void;
}

export function AboutDialog({ onClose }: AboutDialogProps) {
  const [creepy, setCreepy] = useState(false);
  const clickCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleRedClick = () => {
    clickCount.current++;
    if (clickCount.current >= 4) {
      clickCount.current = 0;
      setCreepy(true);
    }
    // Reset le compteur si pas assez rapide
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { clickCount.current = 0; }, 1500);
  };

  useEffect(() => {
    if (!creepy) return;
    document.body.style.background = '#3a0000';
    document.getElementById('desktop')!.style.backgroundColor = '#3a0000';
    const timeout = setTimeout(() => {
      setCreepy(false);
      document.body.style.background = '';
      document.getElementById('desktop')!.style.backgroundColor = '#008080';
    }, 5000);
    return () => {
      clearTimeout(timeout);
      document.body.style.background = '';
      const desktop = document.getElementById('desktop');
      if (desktop) desktop.style.backgroundColor = '#008080';
    };
  }, [creepy]);

  return (
    <div className="about-content">
      <svg width="64" height="64" viewBox="0 0 64 64" style={{ cursor: 'default' }}>
        <rect x="4" y="4" width="24" height="24" fill={creepy ? '#660000' : '#ff0000'}
          style={{ cursor: 'pointer' }} onClick={handleRedClick} />
        <rect x="36" y="4" width="24" height="24" fill={creepy ? '#003300' : '#00aa00'} />
        <rect x="4" y="36" width="24" height="24" fill={creepy ? '#000033' : '#0000ff'} />
        <rect x="36" y="36" width="24" height="24" fill={creepy ? '#333300' : '#ffcc00'} />
      </svg>
      <h2 style={{ color: creepy ? '#cc0000' : undefined }}>
        {creepy ? 'P̷̢i̸͜n̷̛d̶̨o̵w̷̛s̵ ̷9̸8̷' : 'Pindows 98'}
      </h2>
      <p style={{ color: creepy ? '#800000' : undefined }}>
        {creepy ? (
          <>Il vous regarde.<br />Il a toujours regarde.</>
        ) : (
          <>
            Version 4.10.1998<br />
            Copyright &copy; 2026 Pindows Corp.<br /><br />
            Ce systeme d'exploitation est un prototype.<br />
            Toute ressemblance avec un vrai OS est purement intentionnelle.
          </>
        )}
      </p>
      <button className="win98-button" onClick={onClose}>OK</button>
    </div>
  );
}
