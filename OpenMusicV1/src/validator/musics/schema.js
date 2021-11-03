const Joi = require('joi');

const MusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

const songIdSchema = Joi.object({
  songId: Joi.string().min(21).required(),
});

module.exports = { MusicPayloadSchema, songIdSchema };
