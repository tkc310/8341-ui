// url=<FIGMA_DS_URL>?node-id=REPLACE-TEXT-FIELD
// source=packages/ui/src/components/text-field/text-field.tsx
// component=TextField
import figma from 'figma';

const instance = figma.selectedInstance;
const label = instance.getString('Label');
const supportText = instance.getString('Support text');
const error = instance.getString('Error');
const required = instance.getBoolean('Required');
const state = instance.getEnum('State', { Default: 'default', Error: 'error', Disabled: 'disabled', ReadOnly: 'readonly' });

export default {
  example: figma.code`<FormField label="${label}"${required ? ' required' : ''}${supportText ? ` supportText="${supportText}"` : ''}${state === 'error' ? ` error="${error}"` : ''}${state === 'disabled' ? ' disabled' : ''}>
  <TextField${state === 'readonly' ? ' readOnly' : ''} />
</FormField>`,
  imports: ['import { FormField } from "@/components/ui/form-field"', 'import { TextField } from "@/components/ui/text-field"'],
  id: 'text-field',
};
