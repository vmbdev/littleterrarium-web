import { InjectionToken } from '@angular/core';

/**
 * Token with the API URL provided in config.ts.
 */
export const BACKEND_URL = new InjectionToken<string>('BACKEND URL');
