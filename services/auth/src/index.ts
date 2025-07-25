import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`Auth service listening on port ${port}`);
}); 