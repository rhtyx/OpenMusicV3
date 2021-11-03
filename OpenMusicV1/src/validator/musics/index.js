const InvariantError = require('../../exceptions/InvariantError');
const SongIdError = require('../../exceptions/SongIdError');
const { MusicPayloadSchema, songIdSchema } = require('./schema');

const OpenMusicValidator = {
  validateMusicPayload: (payload) => {
    const validationResult = MusicPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongId: (id) => {
    const validationResult = songIdSchema.validate(id);
    if (validationResult.error) {
      throw new SongIdError(validationResult.error.message);
    }
  },
};

module.exports = OpenMusicValidator;
