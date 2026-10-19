// url=<FIGMA_DS_URL>?node-id=REPLACE-NOTIFICATION-BANNER
// source=packages/ui/src/components/ui/NotificationBanner/index.tsx
// component=NotificationBanner
import figma from 'figma';

const instance = figma.selectedInstance;
const title = instance.getString('Title');
const body = instance.getString('Body');
const tone = instance.getEnum('Tone', { Info: 'info', Success: 'success', Warning: 'warning', Danger: 'danger' });
const closable = instance.getBoolean('Closable');

export default {
  example: figma.code`<NotificationBanner tone="${tone}" title="${title}"${closable ? ' onClose={handleClose}' : ''}>
  <p>${body}</p>
</NotificationBanner>`,
  imports: ['import { NotificationBanner } from "@/components/ui/NotificationBanner/index"'],
  id: 'notification-banner',
};
