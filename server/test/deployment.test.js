const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

test('serverless startup and MongoDB readiness', async (t) => {
  let attempts = 0;
  let connect = async () => {
    mongoose.connection.readyState = 1;
    return mongoose;
  };
  t.mock.method(mongoose, 'connect', (...args) => {
    attempts += 1;
    return connect(...args);
  });

  const { connectDB } = require('../src/config/db');
  const app = require('../../api/index');
  const originalUri = process.env.MONGO_URI;
  // No real database is contacted by these tests.
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/edu_exchange_test';
  mongoose.connection.readyState = 0;

  const server = http.createServer(app);
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    mongoose.connection.readyState = 0;
    if (originalUri === undefined) delete process.env.MONGO_URI;
    else process.env.MONGO_URI = originalUri;
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  await t.test('importing the entry point does not connect or auto-seed', () => {
    assert.equal(attempts, 0);
    assert.equal(typeof app, 'function');
  });

  await t.test('health responds without requiring a database connection', async () => {
    const response = await fetch(`${base}/api/health`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).platform, 'Edu Exchange');
    assert.equal(attempts, 0);
  });

  await t.test('data requests wait for connection before route handling', async () => {
    let release;
    let signalStarted;
    const started = new Promise((resolve) => { signalStarted = resolve; });
    connect = () => new Promise((resolve) => {
      release = () => {
        mongoose.connection.readyState = 1;
        resolve(mongoose);
      };
      signalStarted();
    });
    let finished = false;
    const pending = fetch(`${base}/api/auth/me`).then((response) => {
      finished = true;
      return response;
    });
    await started;
    assert.equal(finished, false);
    release();
    const response = await pending;
    // The original /api/auth/me path reaches authentication, not a fallback.
    assert.equal(response.status, 401);
    assert.equal((await response.json()).success, false);
  });

  await t.test('connection failure returns JSON and the next request can retry', async () => {
    mongoose.connection.readyState = 0;
    connect = async () => { throw new Error('Simulated unavailable database'); };
    const failed = await fetch(`${base}/api/auth/me`);
    assert.equal(failed.status, 503);
    assert.match(failed.headers.get('content-type'), /application\/json/);
    assert.match((await failed.json()).message, /Database unavailable/);

    const before = attempts;
    connect = async () => {
      mongoose.connection.readyState = 1;
      return mongoose;
    };
    const retried = await fetch(`${base}/api/auth/me`);
    assert.equal(retried.status, 401);
    assert.equal(attempts, before + 1);
    await retried.json();
  });

  await t.test('concurrent cold starts share one pending connection', async () => {
    mongoose.connection.readyState = 0;
    let release;
    connect = () => new Promise((resolve) => {
      release = () => {
        mongoose.connection.readyState = 1;
        resolve(mongoose);
      };
    });
    const before = attempts;
    const first = connectDB();
    const second = connectDB();
    assert.equal(attempts, before + 1);
    release();
    await Promise.all([first, second]);
    await connectDB();
    assert.equal(attempts, before + 1);
  });
});

test('deployment routes preserve APIs and files before the SPA fallback', () => {
  const root = path.resolve(__dirname, '../..');
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const existingFiles = new Set(['/index.html', '/assets/app.js', '/favicon.svg']);
  const resolve = (url) => {
    const pathname = new URL(url, 'http://localhost').pathname;
    for (const route of config.routes) {
      if (route.handle === 'filesystem') {
        if (existingFiles.has(pathname)) return pathname;
      } else if (new RegExp(`^(?:${route.src})$`).test(pathname)) {
        return route.dest;
      }
    }
    return null;
  };

  assert.equal(config.outputDirectory, 'client/dist');
  assert.equal(config.framework, null);
  assert.ok(fs.existsSync(path.join(root, 'api/index.js')));
  for (const page of ['/', '/login', '/signup', '/skills', '/profile/student-id']) {
    assert.equal(resolve(page), '/index.html');
  }
  for (const api of ['/api', '/api/health', '/api/skills?limit=1', '/api/auth/login']) {
    assert.equal(resolve(api), '/api/index.js');
  }
  for (const asset of ['/assets/app.js', '/favicon.svg']) {
    assert.equal(resolve(asset), asset);
  }
});
