// url=<FIGMA_DS_URL>?node-id=REPLACE-TAG
// source=packages/ui/src/components/tag/tag.tsx
// component=Tag
import figma from 'figma';

const instance = figma.selectedInstance;
const label = instance.getString('Label');
const tone = instance.getEnum('Tone', { Neutral: 'neutral', Key: 'key', Success: 'success', Warning: 'warning', Danger: 'danger' });

export default {
  example: figma.code`<Tag tone="${tone}">${label}</Tag>`,
  imports: ['import { Tag } from "@/components/ui/tag"'],
  id: 'tag',
};
