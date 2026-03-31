import type { StoryTrigger } from './types';
import { story1Triggers } from './stories/story1';
import { story2Triggers } from './stories/story2';
import { story3Triggers } from './stories/story3';
import { story4Triggers } from './stories/story4';

// ---------------------------------------------------------------------------
// All story triggers — just import and spread new stories here.
//
// To add a new story:
//   1. Create game/stories/storyN.ts exporting storyNTriggers
//   2. Import it here and add to STORY_TRIGGERS
// ---------------------------------------------------------------------------

export const STORY_TRIGGERS: StoryTrigger[] = [
  ...story1Triggers,
  ...story2Triggers,
  ...story3Triggers,
  ...story4Triggers,
];
