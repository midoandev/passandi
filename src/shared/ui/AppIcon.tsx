import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import type { IoniconsName, MaterialName, FeatherName } from "@/shared/lib/iconTypes";

type IconLibrary = "ionicons" | "material" | "feather";

type AppIconProps = {
  library?: IconLibrary;
  name: IoniconsName | MaterialName | FeatherName;
  size?: number;
  color?: string;
};

export function AppIcon({
  library = "ionicons",
  name,
  size = 22,
  color = "#fff",
}: AppIconProps) {
  if (library === "material") {
    return (
      <MaterialCommunityIcons name={name as MaterialName} size={size} color={color} />
    );
  }
  if (library === "feather") {
    return <Feather name={name as FeatherName} size={size} color={color} />;
  }
  return <Ionicons name={name as IoniconsName} size={size} color={color} />;
}
