import app from './app';

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`Invoice service listening on port ${port}`);
}); 