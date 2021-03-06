const Command = require('../../classes/Command')

module.exports = new Command(async function (msg, suffix) {
  const client = require('../../components/client')
  const player = client.voiceConnectionManager.get(msg.channel.guild.id)
  if (player) {
    const m = await this.safeSendMessage(msg.channel, 'Working on it...')
    const x = await player.resolve(suffix)
    switch (x.loadType) {
      case 'PLAYLIST_LOADED': {
        if (x.tracks && x.tracks.length > 0) {
          player.addMany(x.tracks)
          return m.edit(`Playlist ${x.playlistInfo.name} has been added`)
        } else return m.edit('Nothing found with your search query')
      }
      case 'SEARCH_RESULT':
      case 'TRACK_LOADED': {
        if (x.tracks && x.tracks.length > 0) {
          player.add(x.tracks[0])
          return m.edit('Your track has been added')
        } else return m.edit('Nothing found with your search query')
      }
      case 'LOAD_FAILED': {
        if (x.exception.severity === 'COMMON') return m.edit(`I'm unable to play that track: \`${x.exception.message}\``)
        else return m.edit("I'm unable to play that track for unknown reasons")
      }
      case 'NO_MATCHES': return m.edit('Nothing found with your search query')
      default: return m.edit('Something went wrong while adding this track, try again later')
    }
  } else return this.safeSendMessage(msg.channel, "I'm not streaming in this server")
}, {
  aliases: ['request'],
  prereqs: ['musicCommand'],
  disableDM: true
})
