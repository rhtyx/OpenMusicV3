class SongIdError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'SongIdError';
  }
}

module.exports = SongIdError;
