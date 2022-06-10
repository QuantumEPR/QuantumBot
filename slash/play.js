const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("loads songs from youtube")
    .addSubcommand( subcommand => subcommand
        .setName("song")
        .setDescription("Loads a single song from a url.")
        .addStringOption( option => option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
        )
    )
    .addSubcommand( subcommand => subcommand
        .setName("playlist")
        .setDescription("Loads a playlist of songs from a url.")
        .addStringOption( option => option
            .setName("url")
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand( subcommand => subcommand
        .setName("search")
        .setDescription("Searches for song based on provided keywords.")
        .addStringOption( option => option
            .setName("searchterms")
            .setDescription("the search keywords")
            .setRequired(true)
        )
    )
    .addSubcommand( subcommand => subcommand
        .setName("sus")
        .setDescription("S U G O M A")
    )
    ,
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be in a VC to use this command")
        }
        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()
        
        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0) {
                return interaction.editReply("No results.")
            }
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0) {
                return interaction.editReply("No results.")
            }
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**[${playlist.title}](${playlist.url})** has been added to the Queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Duration: ${playlist.duration}` })
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0) {
                return interaction.editReply("No results.")
            }
            const song = result.tracks[0]
            const tracksInfo = result.tracks.map((r, i) => `${i + 1}: ${r.title} - ${r.url}`).join('\n')

            await queue.addTrack(song)
            embed
                .setDescription(
                    `${tracksInfo}\n
                    **[${song.title}](${song.url})** have been added to the Queue.`
                )
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        } else if (interaction.options.getSubcommand() === "sus") {
            const susList = [
                "https://c.tenor.com/1bHFBLnruUUAAAAC/among-us.gif",
                "https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png",
                "https://wompampsupport.azureedge.net/fetchimage?siteId=7575&v=2&jpgQuality=100&width=700&url=https%3A%2F%2Fi.kym-cdn.com%2Fphotos%2Fimages%2Fnewsfeed%2F002%2F111%2F316%2Fc57.gif"
            ]
            client.user.setAvatar(susList[Math.random() * susList.length])
            let url = "https://www.youtube.com/watch?v=ekL881PJMjI"
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription("S U S")
            await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    }
}