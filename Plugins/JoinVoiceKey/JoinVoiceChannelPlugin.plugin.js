//META{"name":"JoinVoiceChannelPlugin","displayName":"Join Voice Channel Plugin","website":"https://github.com/Aboda7m/BetterDiscordAddons/blob/2df18d257005b9588ac9676954be307b268eaae8/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js","source":"https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/2df18d257005b9588ac9676954be307b268eaae8/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js"}*//

class JoinVoiceChannelPlugin {
    getName() { return "Join Voice Channel Plugin"; }
    getDescription() { return "Allows you to join a voice channel using keybinds."; }
    getVersion() { return "1.0.0"; }
    getAuthor() { return "Aboda7m"; }

    getSettingsPanel() {
        const settingsPanel = document.createElement("div");

        const keybindInputs = [];

        for (let i = 1; i <= 9; i++) {
            const keybindInput = document.createElement("input");
            keybindInput.type = "text";
            keybindInput.value = this.settings[`keybind${i}`] || "";
            keybindInput.placeholder = `Keybind ${i}`;
            keybindInput.addEventListener("input", (event) => {
                this.settings[`keybind${i}`] = event.target.value;
                this.saveSettings();
            });

            const label = document.createElement("label");
            label.textContent = `Keybind ${i}:`;
            label.appendChild(keybindInput);

            keybindInputs.push(label);
        }

        for (const keybindInput of keybindInputs) {
            settingsPanel.appendChild(keybindInput);
        }

        return settingsPanel;
    }

    loadSettings() {
        this.settings = this.loadData("JoinVoiceChannelPlugin", "settings") || {};

        for (let i = 1; i <= 9; i++) {
            if (!this.settings.hasOwnProperty(`keybind${i}`)) {
                this.settings[`keybind${i}`] = "";
            }
        }
    }

    saveSettings() {
        this.saveData("JoinVoiceChannelPlugin", "settings", this.settings);
    }

    start() {
        const { PluginUtilities } = BdApi;
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Aboda7m/BetterDiscordAddons/2df18d257005b9588ac9676954be307b268eaae8/Plugins/JoinVoiceKey/JoinVoiceChannelPlugin.plugin.js");

        this.loadSettings();

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    stop() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        const keybind = Object.values(this.settings).find((value) => value === event.key);
        if (keybind) {
            const keybindIndex = Object.keys(this.settings).findIndex((key) => this.settings[key] === keybind);
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
}

