/* eslint-disable no-underscore-dangle */
class Listener {
  constructor(PlaylistService, mailSender) {
    this._PlaylistService = PlaylistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());

      const playlist = await this._PlaylistService.getPlaylist(playlistId);
      const result = await this._mailSender.sendMail(targetEmail, JSON.stringify(playlist));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
