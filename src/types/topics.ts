import type { ISODateTimeString } from './commons';

interface Subtopic {
  id: string;
  name: string;
  createdAt: ISODateTimeString;
  modifiedAt: ISODateTimeString;
  modifiedBy: ISODateTimeString;
}

export type { Subtopic };
