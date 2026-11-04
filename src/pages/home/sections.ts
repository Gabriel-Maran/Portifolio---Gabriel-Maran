import type { ComponentType } from 'react';
import type { Face } from '../../cube/model.ts';
import { Contact } from '../../features/contact/Contact.tsx';
import { Experience } from '../../features/experience/Experience.tsx';
import { Method } from '../../features/method/Method.tsx';
import { Projects } from '../../features/projects/Projects.tsx';
import { Stack } from '../../features/stack/Stack.tsx';
import { WhatIDo } from '../../features/what-i-do/WhatIDo.tsx';
import { SECTION_IDS, type SectionKey } from '../../globals/constants.ts';

interface HomeSection {
  key: SectionKey;
  /** Face do cubo da seção: visitar a seção resolve um movimento e acende a cor dela. */
  face: Face;
  Component: ComponentType;
}

/*
 * A ordem da página fica só aqui. A navegação segue esta lista, e a solução do cubo é a
 * sequência das faces (U L R F B D). Mudar a ordem recalcula a solução e o embaralhamento.
 */
export const HOME_SECTIONS: readonly HomeSection[] = [
  { key: 'whatIDo', face: 'U', Component: WhatIDo },
  { key: 'experience', face: 'L', Component: Experience },
  { key: 'projects', face: 'R', Component: Projects },
  { key: 'approach', face: 'F', Component: Method },
  { key: 'stack', face: 'B', Component: Stack },
  { key: 'contact', face: 'D', Component: Contact },
];

export const HOME_SECTION_KEYS = HOME_SECTIONS.map(({ key }) => key);
export const HOME_SECTION_IDS = HOME_SECTIONS.map(({ key }) => SECTION_IDS[key]);
export const HOME_SOLUTION = HOME_SECTIONS.map(({ face }) => face);

export const FACE_BY_SECTION: Readonly<Partial<Record<SectionKey, Face>>> = Object.fromEntries(
  HOME_SECTIONS.map(({ key, face }) => [key, face]),
);

const FACE_BY_SECTION_ID = new Map<string, Face>(
  HOME_SECTIONS.map(({ key, face }) => [SECTION_IDS[key], face]),
);

export const faceOfSectionId = (id: string): Face | undefined => FACE_BY_SECTION_ID.get(id);
