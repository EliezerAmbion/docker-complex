const keys = require('./keys');
const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
  },
});
const sub = redisClient.duplicate();

const fib = (index) => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

(async () => {
  // Connect both clients
  await redisClient.connect();
  await sub.connect();

  // Subscribe to "insert" events
  await sub.subscribe('insert', (message) => {
    const result = fib(parseInt(message));
    console.log(`Calculating fib(${message}) = ${result}`);
    redisClient.hSet('values', message, result);
  });
})();
