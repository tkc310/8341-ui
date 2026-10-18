// url=<FIGMA_DS_URL>?node-id=REPLACE-BUTTON
// source=packages/ui/src/components/button/button.tsx
// component=Button
import figma from 'figma';

const instance = figma.selectedInstance;
const label = instance.getString('Label');
const variant = instance.getEnum('Variant', { Primary: 'primary', Secondary: 'secondary', Tertiary: 'tertiary', Danger: 'danger' });
const size = instance.getEnum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' });
const disabled = instance.getBoolean('Disabled');
const loading = instance.getBoolean('Loading');

export default {
  example: figma.code`<Button variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}>${label}</Button>`,
  imports: ['import { Button } from "@/components/ui/button"'],
  id: 'button',
  metadata: { nestable: true },
};
