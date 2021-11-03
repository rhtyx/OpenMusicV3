/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, PlaylistsService, validator) {
    this._service = service;
    this._validator = validator;
    this.playlistsService = PlaylistsService;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistSongsPayload(request.payload);
      const userId = request.auth.credentials.id;
      const { playlistId } = request.params;

      await this.playlistsService.validatePlaylistsUser(userId, playlistId);

      const message = {
        userId,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan anda dalam antrian',
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
}

module.exports = ExportsHandler;
