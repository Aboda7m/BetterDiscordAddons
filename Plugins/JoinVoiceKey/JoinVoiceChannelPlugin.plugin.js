/**
 * @name JoinVoiceChannelPlugin
 * @displayName Join Voice Channel Plugin
 * @website https://github.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js
 * @source https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js
 */

const { PluginUpdater, PluginUtilities } = BdApi;

class JoinVoiceChannelPlugin {
    getName() { return "Join Voice Channel Plugin"; }
    getDescription() { return "Allows you to join a voice channel using keybinds."; }
    getVersion() { return "1.0.0"; }
    getAuthor() { return "Aboda7m"; }

    load() {
        this.loadSettings();
    }

    start() {
        PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js");
        this.registerKeybinds();
    }

    stop() {
        this.unregisterKeybinds();
    }

    loadSettings() {
        this.settings = PluginUtilities.loadSettings(this.getName(), {});
    }

    saveSettings() {
        PluginUtilities.saveSettings(this.getName(), this.settings);
    }

    registerKeybinds() {
        this.keybindHandlers = {};

        for (let i = 1; i <= 9; i++) {
            const keybind = this.settings[`keybind${i}`];
            if (keybind) {
                const keydownHandler = this.handleKeydown.bind(this, i);
                document.addEventListener("keydown", keydownHandler);
                this.keybindHandlers[i] = keydownHandler;
            }
        }
    }

    unregisterKeybinds() {
        for (const key in this.keybindHandlers) {
            if (Object.prototype.hasOwnProperty.call(this.keybindHandlers, key)) {
                const handler = this.keybindHandlers[key];
                document.removeEventListener("keydown", handler);
            }
        }

        this.keybindHandlers = {};
    }

    handleKeydown(keybindIndex, event) {
        const keybind = this.settings[`keybind${keybindIndex}`];
        if (event.key === keybind) {
            const channelId = this.settings[`channelId${keybindIndex}`]?.trim();
            if (channelId) {
                const voiceChannelElement = document.querySelector(`[data-channel-id="${channelId}"]`);
                if (voiceChannelElement) {
                    voiceChannelElement.click();
                } else {
                    console.error("Voice channel element not found.");
                }
            } else {
                console.error("Voice channel ID not set.");
            }
        }
    }

    getSettingsPanel() {
        const settingsPanel = document.createElement("div");

        for (let i = 1; i <= 9; i++) {
            const keybindInput = document.createElement("input");
            keybindInput.type = "text";
            keybindInput.value = this.settings[`keybind${i}`] || "";
            keybindInput.placeholder = `Keybind ${i}`;
            keybindInput.addEventListener("input", (event) => {
                this.settings[`keybind${i}`] = event.target.value;
                this.saveSettings();
            });

            const channelIdInput = document.createElement("input");
            channelIdInput.type = "text";
            channelIdInput.value = this.settings[`channelId${i}`] || "";
            channelIdInput.placeholder = "Channel ID";
            channelIdInput.addEventListener("input", (event) => {
                this.settings[`channelId${i}`] = event.target.value;
                this.saveSettings();
            });

            const keybindRow = document.createElement("div");
            keybindRow.className = "keybind-row";
            keybindRow.appendChild(keybindInput);
            keybindRow.appendChild(channelIdInput);

            settingsPanel.appendChild(keybindRow);
        }

        return settingsPanel;
    }
}

PluginUpdater.checkForUpdate("Join Voice Channel Plugin", "1.0.0", "https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js");
PluginUtilities.addStyle("JoinVoiceChannelPlugin", `
    .keybind-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }

    .keybind-row input[type="text"] {
        margin-right: 8px;
        padding: 4px;
        width: 100px;
        font-size: 14px;
    }
`);

const joinVoiceChannelPlugin = new JoinVoiceChannelPlugin();

PluginUtilities.add("Join Voice Channel Plugin", joinVoiceChannelPlugin);
