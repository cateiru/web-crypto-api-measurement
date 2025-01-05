import React from "react";
import { useGenKey } from "./useGenKey";

export const useAESEncrypt = (password: string) => {
  const { genKey } = useGenKey(password);

  const encrypt = React.useCallback(
    async (data: string) => {
      const { key, salt } = await genKey();
      const encoded = new TextEncoder().encode(data);

      // 初期化ベクトルを生成
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const start = performance.now();

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
          tagLength: 128,
        },
        key,
        encoded
      );

      const end = performance.now();

      return {
        encrypted,
        iv,
        salt,
        time: end - start,
      };
    },
    [genKey]
  );

  return {
    encrypt,
  };
};
