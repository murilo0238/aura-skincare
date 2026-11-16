const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

export const digits = (value: string) => value.replace(/\D/g, "");

export function formatCep(value: string): string {
  const d = digits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function formatPhone(value: string): string {
  const d = digits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export interface CheckoutValues {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export const emptyCheckout: CheckoutValues = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export function validateField(field: keyof CheckoutValues, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "nome":
      if (!value) return "Informe seu nome completo.";
      if (value.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
      return;
    case "email":
      if (!value) return "Informe seu e-mail.";
      if (!isValidEmail(value)) return "Digite um e-mail válido, como nome@exemplo.com.";
      return;
    case "telefone": {
      const d = digits(value);
      if (!d) return "Informe um telefone com DDD.";
      if (d.length < 10) return "O telefone precisa ter DDD e 8 ou 9 dígitos.";
      return;
    }
    case "cep":
      if (!value) return "Informe o CEP.";
      if (digits(value).length !== 8) return "O CEP precisa ter 8 dígitos.";
      return;
    case "endereco":
      return value ? undefined : "Informe a rua ou avenida.";
    case "numero":
      return value ? undefined : "Informe o número, ou “s/n”.";
    case "bairro":
      return value ? undefined : "Informe o bairro.";
    case "cidade":
      return value ? undefined : "Informe a cidade.";
    case "uf":
      return (UFS as readonly string[]).includes(value) ? undefined : "Selecione o estado.";
    case "complemento":
      return;
  }
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const key of Object.keys(values) as (keyof CheckoutValues)[]) {
    const error = validateField(key, values[key]);
    if (error) errors[key] = error;
  }
  return errors;
}
