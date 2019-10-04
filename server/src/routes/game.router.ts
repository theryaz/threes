import express from 'express';
const router = express.Router();
import { NotFoundError } from '../errors';

router.get('/', (req, res, next) => {
  res.json({result: []});
});


module.exports = router;
