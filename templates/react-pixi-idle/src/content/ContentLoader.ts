import contentPackData from './packs/default/content.json';
import type { TemplateContentPack } from './schemas/ContentTypes';

export function loadDefaultContentPack(): TemplateContentPack {
  return contentPackData as TemplateContentPack;
}
