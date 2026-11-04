import type { ComponentType } from 'react';
import { Contact } from '../../features/contact/Contact.tsx';
import { Experience } from '../../features/experience/Experience.tsx';
import { Method } from '../../features/method/Method.tsx';
import { Projects } from '../../features/projects/Projects.tsx';
import { Stack } from '../../features/stack/Stack.tsx';
import { WhatIDo } from '../../features/what-i-do/WhatIDo.tsx';
import { SECTION_IDS, type SectionKey } from '../../globals/constants.ts';

interface HomeSection {
  key: SectionKey;
  Component: ComponentType;
}

// A ordem da página fica só aqui. A navegação e a página leem desta lista.
export const HOME_SECTIONS: readonly HomeSection[] = [
  { key: 'whatIDo', Component: WhatIDo },
  { key: 'experience', Component: Experience },
  { key: 'projects', Component: Projects },
  { key: 'approach', Component: Method },
  { key: 'stack', Component: Stack },
  { key: 'contact', Component: Contact },
];

export const HOME_SECTION_KEYS = HOME_SECTIONS.map(({ key }) => key);
export const HOME_SECTION_IDS = HOME_SECTIONS.map(({ key }) => SECTION_IDS[key]);
