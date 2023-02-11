export interface MinimalPlugin {
	settingsDirty: boolean;
	saveSettings(): Promise<void>;
}
