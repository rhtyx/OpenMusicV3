const InvariantError = require('../../exceptions/InvariantError');
const ExportPlaylistSongsPayloadSchema = require('./schema');

const ExportValidator = {
  validateExportPlaylistSongsPayload: (payload) => {
    const validationResult = ExportPlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportValidator;
