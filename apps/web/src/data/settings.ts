import { apiRequest } from "./api";

export type SettingsRecord = {
  lockTime: string;
  timezone: string;
  lateThresholdMinutes: number;
};

export async function fetchSettings() {
  return apiRequest<SettingsRecord>("/settings");
}

export async function saveSettings(input: SettingsRecord) {
  return apiRequest<SettingsRecord>("/settings", {
    method: "PATCH",
    body: input,
  });
}
