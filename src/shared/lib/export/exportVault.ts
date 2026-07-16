import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getAllLocalItems } from "@/features/vault/api/vaultApi";
import { useAuthStore } from "@/features/auth/model/authStore";

export type ExportFormat = "json" | "csv";

const sanitize = (val: string | undefined | null): string =>
  val?.replace(/"/g, '""') ?? "";

const rowToCSV = (item: any): string => {
  const fields = [
    item.title, item.username, item.email, item.password,
    item.pin, item.phone, item.url, item.notes,
  ];
  return fields.map((f) => `"${sanitize(f)}"`).join(",");
};

export const exportVault = async (format: ExportFormat = "json"): Promise<void> => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("User not authenticated");

  const items = await getAllLocalItems(userId);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `passandi-export-${timestamp}`;

  if (format === "csv") {
    const header = "Title,Username,Email,Password,PIN,Phone,URL,Notes";
    const rows = items.map(rowToCSV);
    const csv = [header, ...rows].join("\n");
    const path = `${FileSystem.cacheDirectory}${filename}.csv`;
    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: "text/csv" });
    }
  } else {
    const exportData = items.map((item) => ({
      title: item.title,
      categoryId: item.categoryId,
      iconType: item.iconType,
      iconValue: item.iconValue,
      iconColor: item.iconColor,
      username: item.username,
      email: item.email,
      password: item.password,
      pin: item.pin,
      phone: item.phone,
      url: item.url,
      notes: item.notes,
      holderName: item.holderName,
      expiredDate: item.expiredDate,
      customFields: item.customFields,
      exportedAt: new Date().toISOString(),
    }));
    const json = JSON.stringify(exportData, null, 2);
    const path = `${FileSystem.cacheDirectory}${filename}.json`;
    await FileSystem.writeAsStringAsync(path, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: "application/json" });
    }
  }
};
