import express  from 'express';
import productRoutes from './product';

const app = express();

app.use('/api/v1/products', productRoutes);

export default app;