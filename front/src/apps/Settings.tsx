import React from 'react';
import { useGame } from '../game/GameContext';

const Settings: React.FC = () => {
  const { gameState, dispatch } = useGame();

  const handleVolumeChange = (volume: number) => {
    dispatch({ type: 'volume_changed', volume });
  };

  const handleMuteToggle = (muted: boolean) => {
    dispatch({ type: 'mute_toggled', muted });
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '8px',
      fontFamily: 'sans-serif',
      fontSize: '11px',
    }}>
      <fieldset style={{
        border: '1px solid #808080',
        padding: '8px',
        margin: 0,
      }}>
        <legend style={{
          fontSize: '11px',
          fontFamily: 'sans-serif',
          padding: '0 4px',
        }}>
          Sound & Volume
        </legend>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', fontFamily: 'sans-serif' }}>
            Volume: {gameState.volume}
          </label>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={gameState.volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          style={{
            width: '100%',
            marginBottom: '8px',
          }}
        />
        <div>
          <label style={{
            fontSize: '11px',
            fontFamily: 'sans-serif',
            display: 'flex',
            alignItems: 'center',
          }}>
            <input
              type="checkbox"
              checked={gameState.muted}
              onChange={(e) => handleMuteToggle(e.target.checked)}
              style={{ marginRight: '4px' }}
            />
            Mute
          </label>
        </div>
      </fieldset>
    </div>
  );
};

export default Settings;