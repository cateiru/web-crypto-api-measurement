"use client";

import React from "react";

type GenKeyReturns = {
  genKey: () => Promise<{
    key: CryptoKey;
    salt: Uint8Array;
  }>;
  genKeyFromSalt: (salt: Uint8Array) => Promise<{
    key: CryptoKey;
    salt: Uint8Array;
  }>;
};

const importKeyConfig: {
  format: Exclude<KeyFormat, "jwk">;
  algorithm:
    | AlgorithmIdentifier
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesKeyAlgorithm;
  extractable: boolean;
  keyUsages: Iterable<KeyUsage>;
} = {
  format: "raw",
  algorithm: "PBKDF2",
  extractable: false,
  keyUsages: ["deriveKey"],
};

export const useGenKey = (password: string): GenKeyReturns => {
  // 鍵導出関数で password と salt から鍵を生成する
  const genKeyFromSalt = React.useCallback(
    async (salt: Uint8Array) => {
      const pwd = new TextEncoder().encode(password);

      const passwordKey = await window.crypto.subtle.importKey(
        importKeyConfig.format,
        pwd,
        importKeyConfig.algorithm,
        importKeyConfig.extractable,
        importKeyConfig.keyUsages
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 2000,
          hash: "SHA-256",
        },
        passwordKey,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      return {
        key,
        salt,
      };
    },
    [password]
  );

  const genKey = React.useCallback(async () => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));

    return genKeyFromSalt(salt);
  }, [genKeyFromSalt]);

  return {
    genKey,
    genKeyFromSalt,
  };
};
