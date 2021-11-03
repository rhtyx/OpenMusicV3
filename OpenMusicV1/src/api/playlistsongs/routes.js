const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postPlaylistSong,
    options: {
      auth: 'playlists_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getAllPlaylistSongs,
    options: {
      auth: 'playlists_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deletePlaylistSong,
    options: {
      auth: 'playlists_jwt',
    },
  },
];

module.exports = routes;
