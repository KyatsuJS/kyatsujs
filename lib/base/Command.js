"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.defaultMetaData = exports.CommandLocation = void 0;
const tools_1 = require("../tools");
const services_1 = require("../services");
/**
 * Where the command should be executed.
 */
var CommandLocation;
(function (CommandLocation) {
    /**
     * The command will be sent in the global commands.
     */
    CommandLocation[CommandLocation["GLOBAL"] = 0] = "GLOBAL";
    /**
     * The command will be sent in one or few guilds.
     */
    CommandLocation[CommandLocation["GUILD_ONLY"] = 1] = "GUILD_ONLY";
    /**
     * The command will be sent in both places.
     */
    CommandLocation[CommandLocation["BOTH"] = 2] = "BOTH";
})(CommandLocation = exports.CommandLocation || (exports.CommandLocation = {}));
/**
 * Default meta data fields.
 */
exports.defaultMetaData = {
    interferingCommands: [],
    coolDown: 0,
    requiredPermissions: 0n,
    guildOnly: CommandLocation.GLOBAL,
    guilds: [],
};
/**
 * Represents the basic command interaction.
 */
class Command {
    /**
     * The client instance.
     */
    client;
    /**
     * The name of the command.
     */
    name;
    /**
     * The options to implement with the command.
     */
    options;
    /**
     * The options associated with Kyatsu services (cool down, permissions...).
     */
    metaData;
    /**
     * The options to pass if you want to store some personal information.
     */
    additional;
    /**
     * The context of the command, to use interactions with Discord.
     */
    ctx;
    /**
     * The function to call when the command is executed.
     * @type commandCallback
     */
    _run = async () => {
        (0, tools_1.log)('Command interaction ran.');
        return;
    };
    /**
     * @param client The KyaClient instance.
     * @param name The name of the command.
     * @param options The options to implement with the command.
     * @param metaData The options associated with Kyatsu services (cool down, permissions...).
     * @param additional The options to pass if you want to store some personal information.
     */
    constructor(client, name, options, metaData, additional) {
        if (!client)
            throw new Error('Invalid client provided.');
        if (!name) {
            throw new Error('Invalid command name provided.');
        }
        if (!options)
            throw new Error('Invalid command options provided.');
        if (options?.type !== 1) {
            throw new Error('Invalid command type provided. It must be a slash command. Type 1.');
        }
        this.client = client;
        this.name = name;
        this.options = options;
        this.metaData = metaData || exports.defaultMetaData;
        this.additional = additional || {};
    }
    /**
     * Set the context of the command.
     * @param ctx The context instance.
     */
    set context(ctx) {
        this.ctx = ctx;
    }
    /**
     * Set the function to be call back when the command is executed.
     * @param callback The function to call.
     */
    set setRun(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Invalid callback provided. It must be a function.');
        }
        this._run = callback;
    }
    /**
     * Execute the command call back function.
     * @param interaction The interaction associated with the command.
     * @returns Void.
     */
    // @ts-ignore
    async run(interaction) {
        this.context = new services_1.Context(interaction.channel, this, interaction, interaction.user);
        const activeCoolDowns = this.client.Commands.CoolDowns.coolDowns(interaction.user.id, this.name);
        const activeInterfering = this.client.Commands.Interfering.interfering(interaction.user.id, ...(this.metaData.interferingCommands || []));
        if (activeCoolDowns.length > 0) {
            const finishTime = String(activeCoolDowns[0][1] / 1000).split('.')[0];
            if (!this.ctx)
                return;
            return void (await this.ctx.alert({
                title: 'Oops!',
                description: `Slow down! Command **/${this.name}** can't be run again,` + ` waiting time: <t:${finishTime}:R>`,
            }, 'RED'));
        }
        if (activeInterfering.length > 0) {
            if (!this.ctx)
                return;
            return void (await this.ctx.alert({
                title: 'Oops!',
                description: `You can't run this command while **/${activeInterfering.length > 1
                    ? activeInterfering.map((i) => i[0]).join('**, **/')
                    : activeInterfering[0][0]}** is running.`,
            }, 'RED'));
        }
        this.client.Commands.CoolDowns.registerCoolDown(interaction.user.id, this.name, this.metaData.coolDown || 0);
        this.client.Commands.Interfering.registerInterfering(interaction.user.id, this.name, interaction.id);
        await this._run(this, interaction);
    }
    end() {
        if (!this.ctx)
            return;
        if (!this.ctx.interaction)
            return;
        this.client.Commands.Interfering.removeInterfering(this.ctx?.interaction.user.id, this.ctx?.interaction.id);
    }
}
exports.Command = Command;
