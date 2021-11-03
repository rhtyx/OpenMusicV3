const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().min(21).required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostPlaylistSongsPayloadSchema,
};
