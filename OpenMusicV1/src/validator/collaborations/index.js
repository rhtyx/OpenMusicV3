const InvariantError = require('../../exceptions/InvariantError');
const PostCollaborationSchema = require('./schema');

const CollaborationsValidator = {
  validatePostCollaboration: (payload) => {
    const validationResult = PostCollaborationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
