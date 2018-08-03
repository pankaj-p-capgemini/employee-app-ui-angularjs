var env = {};

// Import variables if present (from env.config.js)
if (window) {
    Object.assign(env, window.__env);
}

// Register environment in AngularJS as constant
app.constant('__env', env);