import { PindowsLogo } from '../../icons';

interface AboutDialogProps {
  onClose: () => void;
}

export function AboutDialog({ onClose }: AboutDialogProps) {
  return (
    <div className="about-content">
      <PindowsLogo />
      <h2>Pindows 98</h2>
      <p>
        Version 4.10.1998<br />
        Copyright &copy; 2026 Pindows Corp.<br /><br />
        Ce systeme d'exploitation est un prototype.<br />
        Toute ressemblance avec un vrai OS est purement intentionnelle.
      </p>
      <button className="win98-button" onClick={onClose}>OK</button>
    </div>
  );
}
