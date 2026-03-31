import { useState, useCallback } from 'react';
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

  const handleChange = useCallback((key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const allFilled = fields.every(f => data[f.key]?.trim());

  const handleSubmit = useCallback(() => {
    if (!allFilled) return;
    onSubmit(formId, data);
  }, [allFilled, formId, data, onSubmit]);

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
            </div>
          ))}
        </div>
        <div className="story-form-actions">
          <button
            className="win98-button"
            onClick={handleSubmit}
            disabled={!allFilled}
          >
            {submitLabel ?? 'Valider'}
          </button>
        </div>
      </div>
    </div>
  );
}
