interface QuestNotificationProps {
  text: string;
}

export function QuestNotification({ text }: QuestNotificationProps) {
  const signMatch = text.match(/\n\n— (.+)$/);
  const body = signMatch ? text.slice(0, signMatch.index) : text;
  const signature = signMatch ? signMatch[1] : null;

  return (
    <div className="quest-notification-overlay">
      <div className="quest-notification">
        <div className="quest-notification-icon">📋</div>
        <div className="quest-notification-text">{body}</div>
        {signature && (
          <div className="quest-notification-signature">— {signature}</div>
        )}
      </div>
    </div>
  );
}
