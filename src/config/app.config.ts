'use strict';

import { SuperDate } from '../utilities/SuperDate';

export const ENVIRONMENT_DEVELOPMENT: string = 'development';
export const ENVIRONMENT_PRODUCTION: string = 'production';
export const CURRENT_ENVIRONMENT: string = ENVIRONMENT_DEVELOPMENT;

export const STATUS_AVAILABLE_BOX: number = -1;
export const STATUS_UNAVAILABLE_BOX: number = 1;

export const EXCLUDED_FLOOR_NUMBER: any = [0];
export const DEFAULT_PAGE: string = 'home';
export const DEFAULT_FLOOR_NUMBER: number = 6;

export const CALENDAR_DEV_MIN_DATE: SuperDate = new SuperDate('2017-02-17');

export const RESERVABLE_ROOMS: string[] = ['Salle Formation (4e)', 'PC Agence BRE', 'Salle réunion (1er)', 'Salle réunion (6e)', 'Visio écran (4e)', 'Visio projecteur (4e)'];