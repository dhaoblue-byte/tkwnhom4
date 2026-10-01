module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'sontung_mtp_default_secret_sky_2026',
  jwtExpire: process.env.JWT_EXPIRES_IN || '7d',
  saltRounds: 10
};
