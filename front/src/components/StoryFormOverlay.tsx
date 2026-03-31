import { useState, useCallback, useEffect } from 'react';
import type { FormField } from '../game/types';

interface StoryFormOverlayProps {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit: (formId: string, data: Record<string, string>) => void;
}

export function StoryFormOverlay({ formId, title, description, fields, submitLabel, onSubmit }: StoryFormOverlayProps) {
  const [data, setData] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const isAllButtons = fields.every(f => f.type === 'button');
  const isChoice = fields.some(f => f.type === 'choice');
  const textFields = fields.filter(f => f.type !== 'button' && f.type !== 'choice');
  const buttonFields = fields.filter(f => f.type === 'button');
  const allTextFilled = textFields.every(f => data[f.key]?.trim());
  const allButtonsClicked = buttonFields.every(f => data[f.key]);

  useEffect(() => {
    if (isAllButtons && allButtonsClicked) {
      const t = setTimeout(() => onSubmit(formId, data), 400);
      return () => clearTimeout(t);
    }
  }, [isAllButtons, allButtonsClicked, formId, data, onSubmit]);

  const handleChoice = useCallback((key: string, value: string) => {
    onSubmit(formId, { choice: key, value });
  }, [formId, onSubmit]);

  const handleSubmit = useCallback(() => {
    if (!allTextFilled) return;
    onSubmit(formId, data);
  }, [allTextFilled, formId, data, onSubmit]);

  return (
    <div className="story-form-overlay">
      <div className="story-form-box" onClick={e => e.stopPropagation()}>
        <div className="story-form-titlebar">
          <span className="story-form-titlebar-text">{title}</span>
        </div>
        {description && <div className="story-form-desc">{description}</div>}
        <div className="story-form-fields">
          {fields.map(field => (
            <div key={field.key} className="story-form-field">
              {field.type === 'choice' ? (
                <button
                  className="win98-button"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontSize: 12,
                    cursor: 'pointer',
                    background: '#c0c0c0',
                  }}
                  onClick={() => handleChoice(field.key, field.label)}
                >
                  {field.label}
                </button>
              ) : field.type === 'button' ? (
                <button
                  className="win98-button"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: 12,
                    cursor: data[field.key] ? 'default' : 'pointer',
                    opacity: data[field.key] ? 0.5 : 1,
                    background: data[field.key] ? '#a0a0a0' : '#c0c0c0',
                  }}
                  disabled={!!data[field.key]}
                  onClick={() => handleChange(field.key, 'clicked')}
                >
                  {data[field.key] ? '✓ ' : '▸ '}{field.label}
                </button>
              ) : (
                <>
                  <label>{field.label}</label>
                  {field.type === 'color' ? (
                    <div className="story-form-color-wrapper">
                      <input
                        type="color"
                        value={data[field.key] || '#000080'}
                        onChange={e => handleChange(field.key, e.target.value)}
                      />
                      <span className="story-form-color-label">{data[field.key] || '#000080'}</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={data[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {!isAllButtons && !isChoice && (
          <div className="story-form-actions">
            <button
              className="win98-button"
              onClick={handleSubmit}
              disabled={!allTextFilled}
            >
              {submitLabel ?? 'Valider'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
