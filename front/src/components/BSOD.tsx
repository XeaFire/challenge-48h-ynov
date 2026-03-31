import { useEffect } from 'react';

interface BSODProps {
  visible: boolean;
  onDismiss: () => void;
}

export function BSOD({ visible, onDismiss }: BSODProps) {
  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', onDismiss, { once: true });
    return () => document.removeEventListener('keydown', onDismiss);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="bsod" onClick={onDismiss}>
      <br /><br />
      &nbsp;&nbsp;&nbsp;Pindows
      <br /><br />
      &nbsp;&nbsp;&nbsp;A fatal exception 0E has occurred at 0028:C0034B03 in VXD VWIN32(01)
      + 00010E36. The current application will be terminated.
      <br /><br />
      &nbsp;&nbsp;&nbsp;* Press any key to terminate the current application.
      <br />
      &nbsp;&nbsp;&nbsp;* Press CTRL+ALT+DEL again to restart your computer. You will
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lose any unsaved information in all applications.
      <br /><br /><br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Press any key to continue _
    </div>
  );
}
