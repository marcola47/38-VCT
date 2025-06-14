export function capitalize(value?: string): string {
  value = value?.trim();
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

export function titleCase(value?: string): string {
  value = value?.trim();
  return value ? value.split(/\s+/).map(v => capitalize(v)).join(" ") : "";
}
