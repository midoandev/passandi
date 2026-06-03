import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

type IconLibrary = "ionicons" | "material" | "feather";

type AppIconProps = {
  library?: IconLibrary;
  name: string;
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
      <MaterialCommunityIcons name={name as any} size={size} color={color} />
    );
  }
  if (library === "feather") {
    return <Feather name={name as any} size={size} color={color} />;
  }
  return <Ionicons name={name as any} size={size} color={color} />;
}
