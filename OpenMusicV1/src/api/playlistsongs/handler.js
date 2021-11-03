const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSong = this.postPlaylistSong.bind(this);
    this.getAllPlaylistSongs = this.getAllPlaylistSongs.bind(this);
    this.deletePlaylistSong = this.deletePlaylistSong.bind(this);
  }

  async postPlaylistSong(request, h) {
    try {
      this._validator.validatePostPlaylistSongsPayload(request.payload);

      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: userId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(userId, playlistId);

      await this._service.addSong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
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
        message: 'Maaf, terjadi kegagalan pada server',
      });

      response.code(500);
      return response;
    }
  }

  async getAllPlaylistSongs(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: ownerId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(ownerId, playlistId);

      const songs = await this._service.getSongs(playlistId);

      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);

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
        message: 'Maaf, terjadi kegagalan pada server',
      });

      response.code(500);
      return response;
    }
  }

  async deletePlaylistSong(request, h) {
    try {
      this._validator.validatePostPlaylistSongsPayload(request.payload);

      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: ownerId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(ownerId, playlistId);

      await this._service.deleteSong(songId, playlistId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);

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
        message: 'Maaf, terjadi kegagalan pada server',
      });

      response.code(500);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
