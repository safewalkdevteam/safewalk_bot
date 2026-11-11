import { Events } from "discord.js";
import { prisma } from "../../services/db.js"
import { getWebStream } from "../../services/attachments.js";
import { uploadFile } from "../../services/drive/uploadFile.js";

export const name = Events.MessageCreate;
export const once = false;
export const execute = async function(message, client) {
    if (message.guildId) {
        const channel_object = {
            guild_id: message.guildId,
            channel_id: message.channelId
        }
        const channel = await prisma.sync_Channel.findUnique({
            where: { guild_id_channel_id: channel_object }
        });
        if (channel) {
            message.attachments.forEach(async (attachment) => {
                const webStream = await getWebStream(attachment.attachment);
                await uploadFile(webStream, attachment.name, attachment.contentType);
            });
        }
    }

    if (!message.interaction) {
        if (message.content.startsWith(client.config.prefix)) {
            const args = message.content.split(/\s+/);
            const commandName = args[0].slice(client.config.prefix.length, args[0].length);
            const command = client.commands.get(commandName);
            if (command) {
                await command.execute(message)
            } else {
                await message.reply("Sorry, I do not understand this command.");
            }
        }
    }
};