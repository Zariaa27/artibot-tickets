import Artibot, { Button, Command, Embed, Module } from "artibot";
import Localizer from "artibot-localizer";
import { ButtonInteraction, EmbedBuilder, Role, TextChannel } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

/**
 * Tickets module for Artibot
 * @author Zariaa27
 */
export default ({ config: { lang } }: Artibot): Module => {
	localizer.setLocale(lang);

	return new Module({
		id: "tickets",
		name: "Tickets",
		version,
		langs: [
			"en",
			"fr"
		],
		repo: "Zariaa27/artibot-tickets",
		packageName: "artibot-tickets",
		parts: [
			new Button({
				id: "ticket-create",
				mainFunction: ticketCreate
			}),
			new Button({
				id: "ticket-delete",
				mainFunction: ticketDelete
			}),
			/**
			*new Command({
			*	id: "createrolepicker",
			*	name: "createrolepicker",
			*	description: localizer._("Create a role picker."),
			*	usage: localizer._("<list of buttons to create (following the text:mode:id format) (ex.: Sample role:toggle:796899707045543946, Add-only role:addonly:796899707045543946)>"),
			*	guildOnly: true,
			*	requiresArgs: true,
			*	mainFunction: createRolePicker
			*})
			*/
		]
	})
}

export const localizer = new Localizer({
	filePath: path.join(__dirname, "../locales.json")
});

/**
 * Function to create user tickets
 */
async function ticketCreate(interaction: ButtonInteraction<"cached">, { createEmbed }: Artibot): Promise<void> {
	const username: string = interaction.member.displayName;

	if (interaction.guild.channels.resolve("ticket-" + username)) {
		interaction.reply(localizer._("Nope, you already have a ticket open!"));
		return;
	}

	const channel: TextChannel = await interaction.guild.channels.create({ name: "ticket-" + username });
	const deleteButton = new ButtonBuilder()
		.setLabel("Supprimer/Delete")
		.setStyle(ButtonStyle.Danger)
		.setCustomId(`deleteticket`)
	const embed: EmbedBuilder = createEmbed()
		.setTitle("Ticket")
		.setAuthor({ name: username })
		.setDescription(localizer._("Ticket has been created: <#" + channel.id + ">"));

	const ticketEmbed: EmbedBuilder = createEmbed()
		.setTitle("Ticket")
		.setDescription(localizer._("Welcome! A staff member will be with you shortly.\nPlease keep in mind you have to stay respectful as we all will be with you."));
	channel.send({
		embeds: [ticketEmbed],
		components: [deleteButton]
	});

	await interaction.reply({
		embeds: [embed],
		ephemeral: true
	});
}

const collectorFilter = i => i.user.id === interaction.user.id;
const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter });

if (confirmation.customId === 'deleteButton') {
	ticketDelete
};

/**
 * Function to delete user tickets
 */
async function ticketDelete(interaction: ButtonInteraction<"">, { createEmbed }: Artibot): Promise<void> {

	function sleep(seconds) {
		return new Promise(r => setTimeout(r, seconds * 1000))
	};
	const deleteTicketEmbed: EmbedBuilder = createEmbed()
		.setTitle(localizer._("Ticket Deletion"))
		.setDescription(localizer._("This ticket will be deleted in 10 seconds."));

	interaction.reply({
		embeds: [deleteTicketEmbed],
		ephemeral: true
	})

	sleep(10)
	interaction.channel?.delete

}