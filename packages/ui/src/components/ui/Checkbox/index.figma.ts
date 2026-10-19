// url=<FIGMA_DS_URL>?node-id=REPLACE-CHECKBOX
// source=packages/ui/src/components/ui/Checkbox/index.tsx
// component=Checkbox
import figma from 'figma';

const instance = figma.selectedInstance;
const label = instance.getString('Label');
const checked = instance.getEnum('Checked', { Off: 'off', On: 'on', Mixed: 'mixed' });
const disabled = instance.getBoolean('Disabled');

export default {
  example: figma.code`<Checkbox label="${label}"${checked === 'on' ? ' defaultChecked' : ''}${checked === 'mixed' ? ' indeterminate' : ''}${disabled ? ' disabled' : ''} />`,
  imports: ['import { Checkbox } from "@/components/ui/Checkbox/index"'],
  id: 'checkbox',
};
