import type { StoryTrigger } from './types';
import { story1Triggers } from './stories/story1';
import { story2Triggers } from './stories/story2';
import { story3Triggers } from './stories/story3';
import { story4Triggers } from './stories/story4';
import { story5Triggers } from './stories/story5';
import { story6Triggers } from './stories/story6';

export const STORY_TRIGGERS: StoryTrigger[] = [
  ...story1Triggers,
  ...story2Triggers,
  ...story3Triggers,
  ...story4Triggers,
  ...story5Triggers,
  ...story6Triggers,
];
