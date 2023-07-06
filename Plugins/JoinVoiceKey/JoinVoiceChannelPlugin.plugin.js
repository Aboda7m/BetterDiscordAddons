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

    constructor() {
        this.settingsKey = "JoinVoiceChannelPlugin_Settings";
        this.defaultKeybinds = {
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
        };
    }

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
        try {
            this.settings = bdPluginStorage.get(this.getName(), this.settingsKey) || {};
        } catch (err) {
            console.error(`Failed to load settings for plugin ${this.getName()}:`, err);
            this.settings = {};
        }

        // Apply default keybinds if not set in settings
        for (let i = 1; i <= 9; i++) {
            if (!this.settings[`channelId${i}`]) {
                this.settings[`channelId${i}`] = "";
                this.settings[`keybind${i}`] = this.defaultKeybinds[i];
            }
        }
    }

    saveSettings() {
        try {
            bdPluginStorage.set(this.getName(), this.settingsKey, this.settings);
        } catch (err) {
            console.error(`Failed to save settings for plugin ${this.getName()}:`, err);
        }
    }

    registerKeybinds() {
        this.keybindHandlers = {};

        for (let i = 1; i <= 9; i++) {
            const keybind = `Digit${i}`;
            const keydownHandler = this.handleKeydown.bind(this, i);
            document.addEventListener("keydown", keydownHandler);
            this.keybindHandlers[i] = keydownHandler;
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
        const keybind = `Digit${keybindIndex}`;
        if (event.ctrlKey && event.shiftKey && event.code === keybind) {
            const channelId = this.settings[`channelId${keybindIndex}`]?.trim();
            if (channelId) {
                const voiceChannelElement = document.querySelector(`[data-channel-id="${channelId}"]`);
                if (voiceChannelElement) {
                    voiceChannelElement.click();
                } else {
                    console.error("Voice channel element not found.");
                    BdApi.showToast("Failed to join voice channel: Voice channel element not found.", { type: "error" });
                }
            } else {
                console.error("Voice channel ID not set.");
                BdApi.showToast("Failed to join voice channel: Voice channel ID not set.", { type: "error" });
            }
        }
    }

    getSettingsPanel() {
        const settingsPanel = document.createElement("div");

        for (let i = 1; i <= 9; i++) {
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
            keybindRow.appendChild(channelIdInput);

            settingsPanel.appendChild(keybindRow);
        }

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Settings";
        saveButton.addEventListener("click", () => {
            this.saveSettings();
        });

        const loadButton = document.createElement("button");
        loadButton.textContent = "Load Settings";
        loadButton.addEventListener("click", () => {
            this.loadSettings();
            this.updateSettingsPanel();
        });

        settingsPanel.appendChild(saveButton);
        settingsPanel.appendChild(loadButton);

        return settingsPanel;
    }
}

const joinVoiceChannelPlugin = new JoinVoiceChannelPlugin();
joinVoiceChannelPlugin.load();

const joinVoiceChannelPluginElement = document.createElement("div");
joinVoiceChannelPluginElement.id = "JoinVoiceChannelPlugin";
joinVoiceChannelPluginElement.style.display = "none";
joinVoiceChannelPluginElement.appendChild(joinVoiceChannelPlugin.getSettingsPanel());
document.body.appendChild(joinVoiceChannelPluginElement);
