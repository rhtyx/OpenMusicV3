/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: `SELECT playlistsongs.song_id AS id, openmusic.title, openmusic.performer
          FROM playlistsongs
          LEFT JOIN openmusic ON openmusic.id = playlistsongs.song_id
          WHERE playlistsongs.playlist_id = $1;`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistService;
