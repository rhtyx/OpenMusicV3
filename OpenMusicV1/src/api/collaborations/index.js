const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const collabotarionsHandler = new CollaborationsHandler(service, playlistsService, validator);
    server.route(routes(collabotarionsHandler));
  },
};
