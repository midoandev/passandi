# Styling — Passandi

## Warna — Selalu dari Theme Tokens

```tsx
const { tokens } = useTheme();

// ✅ Dinamis (dark/light) dari tokens
<View style={{ backgroundColor: tokens.bg }} />

// ✅ Brand statis dari colors
import { colors } from "@/shared/config/ThemeContext";
<View style={{ backgroundColor: colors.brand.blue }} />

// ❌ Jangan hardcode hex
<View style={{ backgroundColor: "#0F1E33" }} />
```

### Theme Tokens

| Token | Kegunaan |
|---|---|
| `tokens.bg` | background utama |
| `tokens.surface` | card, input, bottom sheet |
| `tokens.border` | garis pembatas (0.5px) |
| `tokens.text` | teks utama |
| `tokens.muted` | teks sekunder |
| `tokens.subtle` | placeholder, label kecil |

### Brand Colors

```ts
colors.brand.navy   → #1E3A5F
colors.brand.blue   → #2563EB
colors.brand.light  → #EFF6FF
colors.brand.gold   → #F59E0B
colors.brand.danger → #EF4444
```

---

## Styling — StyleSheet + style{{}} untuk Dinamis

```tsx
// ✅ Layout statis di StyleSheet
const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14 },
});

// ✅ Warna dinamis inline
<View style={[styles.card, { backgroundColor: tokens.surface, borderColor: tokens.border }]} />

// ❌ Jangan NativeWind/Tailwind className
<View className="bg-blue-500 p-4" />
```
