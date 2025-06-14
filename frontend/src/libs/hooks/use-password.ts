"use client"
import { useState, useEffect } from "react"
import { validatePasswordStrength } from "../validators";

export function usePassword() {
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [passwordTyped, setPasswordTyped] = useState<boolean>(false);

  useEffect(() => {
    if (!passwordTyped && password.length > 0)
      setPasswordTyped(true);

    setPasswordError("");
    setPasswordStrength(validatePasswordStrength(password));
  }, [password, passwordTyped]);

  return {
    password, setPassword,
    passwordError, setPasswordError,
    passwordStrength,
    passwordTyped
  }
}