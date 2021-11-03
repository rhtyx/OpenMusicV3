/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(colService, cacheService) {
    this._pool = new Pool();
    this._colService = colService;
    this._cacheService = cacheService;
  }

  async addSong(playlistId, songId) {
    const id = `Psongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dimasukkan ke playlist.');
    }

    await this._cacheService.delete(`playlist:${playlistId}`);
  }

  async verifyPlaylistOwner(ownerId, id) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(userId, playlistId) {
    try {
      await this.verifyPlaylistOwner(userId, playlistId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._colService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async getSongs(id) {
    try {
      const result = await this._cacheService.get(`playlist:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT playlistsongs.song_id AS id, openmusic.title, openmusic.performer
          FROM playlistsongs
          LEFT JOIN openmusic ON openmusic.id = playlistsongs.song_id
          WHERE playlistsongs.playlist_id = $1;`,
        values: [id],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`playlist:${id}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async deleteSong(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist');
    }

    await this._cacheService.delete(`playlist:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
