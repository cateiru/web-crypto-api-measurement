import React from "react";
import { useGenKey } from "./useGenKey";

export const useAESDecrypt = (password: string) => {
  const { genKeyFromSalt } = useGenKey(password);

  const decrypt = React.useCallback(
    async (encrypted: ArrayBuffer, salt: Uint8Array, iv: Uint8Array) => {
      const key = await genKeyFromSalt(salt);

      const start = performance.now();

      const buffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
          tagLength: 128,
        },
        key.key,
        encrypted
      );

      const end = performance.now();

      return {
        decoded: new TextDecoder().decode(buffer),
        time: end - start,
      };
    },
    [genKeyFromSalt]
  );

  return {
    decrypt,
  };
};
