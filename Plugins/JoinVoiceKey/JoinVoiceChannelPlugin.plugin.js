/**
 * @name JoinVoiceChannelPlugin
 * @displayName Join Voice Channel Plugin
 * @website https://github.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js
 * @source https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/master/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js
 * @version 1.0.0
 * @author Aboda7m
 * @description Allows you to join a voice channel using keybinds.
 * @donate https://example.com/donate
 * @invite https://example.com/invite
 */

class JoinVoiceChannelPlugin {
    getName() { return "Join Voice Channel Plugin"; }
    getDescription() { return "Allows you to join a voice channel using keybinds."; }
    getVersion() { return "1.0.0"; }
    getAuthor() { return "Aboda7m"; }

    load() {
        this.loadSettings();
    }

    start() {
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

            const registerButton = document.createElement("button");
            registerButton.textContent = "Register";
            registerButton.addEventListener("click", () => {
                this.registerKeybind(i, keybindInput.value);
            });

            const keybindRow = document.createElement("div");
            keybindRow.className = "keybind-row";
            keybindRow.appendChild(keybindInput);
            keybindRow.appendChild(channelIdInput);
            keybindRow.appendChild(registerButton);

            settingsPanel.appendChild(keybindRow);
        }

        return settingsPanel;
    }

    registerKeybind(index, keybind) {
        const currentKeybind = this.settings[`keybind${index}`];
        if (currentKeybind && currentKeybind !== keybind) {
            document.removeEventListener("keydown", this.keybindHandlers[index]);
            delete this.keybindHandlers[index];
        }

        if (keybind) {
            const keydownHandler = this.handleKeydown.bind(this, index);
            document.addEventListener("keydown", keydownHandler);
            this.keybindHandlers[index] = keydownHandler;
            this.settings[`keybind${index}`] = keybind;
            this.saveSettings();
        }
    }
}

class PluginUtilities {
    static loadSettings(pluginName) {
        try {
            return bdPluginStorage.get(pluginName, "settings");
        } catch (err) {
            console.error(`Failed to load settings for plugin ${pluginName}:`, err);
            return {};
        }
    }

    static saveSettings(pluginName, settings) {
        try {
            bdPluginStorage.set(pluginName, "settings", settings);
        } catch (err) {
            console.error(`Failed to save settings for plugin ${pluginName}:`, err);
        }
    }
}

const joinVoiceChannelPlugin = new JoinVoiceChannelPlugin();
joinVoiceChannelPlugin.load();

const joinVoiceChannelPluginElement = document.createElement("div");
joinVoiceChannelPluginElement.id = "JoinVoiceChannelPlugin";
joinVoiceChannelPluginElement.style.display = "none";
joinVoiceChannelPluginElement.appendChild(joinVoiceChannelPlugin.getSettingsPanel());
document.body.appendChild(joinVoiceChannelPluginElement);
