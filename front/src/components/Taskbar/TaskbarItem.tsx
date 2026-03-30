interface TaskbarItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

export function TaskbarItem({ title, isActive, onClick }: TaskbarItemProps) {
  return (
    <button
      className={`taskbar-item${isActive ? ' active' : ''}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
