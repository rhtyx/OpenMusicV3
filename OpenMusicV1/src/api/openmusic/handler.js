const ClientError = require('../../exceptions/ClientError');
const SongIdError = require('../../exceptions/SongIdError');

/* eslint-disable no-underscore-dangle */
class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
    this.getAllMusicsHandler = this.getAllMusicsHandler.bind(this);
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this);
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
  }

  async postMusicHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      const songId = await this._service.addMusic({
        title, year, performer, genre, duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);

        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      response.code(500);

      return response;
    }
  }

  async getAllMusicsHandler() {
    const songs = await this._service.getAllMusics();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._validator.validateSongId({ songId });
      const song = await this._service.getMusicById(songId);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(404);
        return response;
      } if (error instanceof SongIdError) {
        const response = h.response({
          status: 'fail',
          message: 'songId anda tidak valid',
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terdapat kegagalan pada server kami',
      });

      response.code(500);
      return response;
    }
  }

  async putMusicByIdHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const { songId } = request.params;
      await this._validator.validateSongId({ songId });

      await this._service.editMusicById(songId, request.payload);

      return {
        status: 'success',
        message: 'Music berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: 'halo',
        });

        response.code(error.statusCode);
        return response;
      } if (error instanceof SongIdError) {
        const response = h.response({
          status: 'fail',
          message: 'songId anda tidak valid',
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terdapat kegagalan pada server kami',
      });

      response.code(500);
      return response;
    }
  }

  async deleteMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._validator.validateSongId({ songId });
      await this._service.deleteMusicById(songId);

      return {
        status: 'success',
        message: 'Music berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(404);
        return response;
      } if (error instanceof SongIdError) {
        const response = h.response({
          status: 'fail',
          message: 'songId anda tidak valid',
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terdapat kegagalan pada server kami',
      });

      response.code(500);
      return response;
    }
  }
}

module.exports = OpenMusicHandler;
