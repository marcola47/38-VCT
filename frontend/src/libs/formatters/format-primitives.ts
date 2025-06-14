export function formatNumberOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatAlphabeticalOnly(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, "");
}

export function formatAlphanumericOnly(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

export function formatURI(value: string) {
  return value.replace(/ /g, "-").replace(/[^a-z0-9/-]/g, "");
}