import { StartLogo } from '../../icons';

interface StartButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

/**
 * Bouton "Demarrer" de la barre des taches.
 * Affiche le logo Pindows et change d'apparence quand le menu est ouvert.
 */
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
