import { StartLogo } from '../../icons';

interface StartButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

export function StartButton({ isMenuOpen, onClick }: StartButtonProps) {
  return (
    <button
      id="start-btn"
      className={isMenuOpen ? 'active' : ''}
      onClick={onClick}
    >
      <StartLogo />
      Demarrer
    </button>
  );
}
