import { SlashCommandBuilder, PermissionsBitField, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { prisma } from "../../../services/db.js"

export const data = new SlashCommandBuilder().setName("register").setDescription("Set daily shift pings for this server.");

export const execute = async (interaction) => {
    const messageReply = {
        content: "",
        flags: MessageFlags.Ephemeral
    }

    const channelId = interaction.channelId;
    const guildId = interaction.guildId;
    if (!guildId) {
        messageReply.content = "You cannot run this command in DMs."
        await interaction.reply(messageReply);
        return;
    }
    
    const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    let userId;
    if (interaction instanceof ChatInputCommandInteraction) {
        userId = interaction.user.id;
    } else {
        userId = interaction.author.id;
    }
    try {
        if (userId === process.env.dev_id || isAdmin) {
            const channel_object = {
                guild_id: guildId,
                channel_id: channelId
            }
            
            const channel = await prisma.ping_Channel.findUnique({
                where: { guild_id_channel_id: channel_object }
            });

            if (channel) {
                messageReply.content = "This channel has already been set for pings."
                await interaction.reply(messageReply);
                return;
            }

            await prisma.ping_Channel.create({
                data: channel_object
            });
            
            messageReply.content = "This channel has been successfully set for pings!";
            await interaction.reply(messageReply);

        } else {
            messageReply.content = "Insufficient permissions to run this command.";
            await interaction.reply(messageReply);
        }
    } catch (exception) {
        console.log(exception);
        messageReply.content = "Something went wrong. Please try again.";
        await interaction.reply(messageReply);
    }
}