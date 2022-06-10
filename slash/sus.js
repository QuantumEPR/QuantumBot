const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueryType } = require("discord-player")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sus")
    .setDescription("S U G O M A"),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        let embed = new MessageEmbed()
        client.user.setAvatar("https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png")
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
}