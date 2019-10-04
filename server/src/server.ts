import express from 'express';
import { logger } from './shared';

import App from './app';

const PORT = process.env.PORT || 4280;

App.listen(PORT);