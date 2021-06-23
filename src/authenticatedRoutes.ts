import { Router } from 'express'

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import SummonerController from './controllers/SummonerController';

const authenticatedRoutes = Router();

authenticatedRoutes.use(authenticationMiddleware);

authenticatedRoutes.get('/summoners', SummonerController.index);
authenticatedRoutes.post('/summoners', SummonerController.create);

export default authenticatedRoutes;