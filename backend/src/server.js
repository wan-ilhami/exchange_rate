const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting DB connection (${retries + 1}/${maxRetries})`);
      await pool.query('SELECT NOW()');
      console.log('Database connection successful');
      break;
    } catch (err) {
      retries++;
      console.log(`Database failed: ${err.message}`);

      if (retries === maxRetries) {
        console.error("Could not connect to database");
        process.exit(1);
      }

      console.log("Retry in 3s...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();

module.exports = app; // keep for Supertest (optional)
