/**
 * Active API client. Replace `mockApi` with HTTP adapter when backend lands.
 */
import { mockApi } from './mock/store';
import type { TcbApi } from './types';

export const api: TcbApi = mockApi;

export type { TcbApi } from './types';
