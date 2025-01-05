import { Box, Heading, Spinner, Table, Text } from "@chakra-ui/react";
import { Button } from "./components/ui/button";
import { DATASET } from "./components/dataset";
import { ToggleTip } from "./components/ui/toggle-tip";
import React from "react";
import { useAESDecrypt } from "./components/useAESDecrypt";
import { useAESEncrypt } from "./components/useAESEncrypt";
import { TbAlertTriangle, TbCheck } from "react-icons/tb";

const PASSWORD = "password";

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<
    [number | null, number | null, boolean][]
  >([]);

  const { encrypt } = useAESEncrypt(PASSWORD);
  const { decrypt } = useAESDecrypt(PASSWORD);

  const randomDatasets = React.useMemo(() => {
    return DATASET.sort(() => Math.random() - 0.5);
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    setResult([]);

    for (const item of randomDatasets) {
      try {
        const encrypted = await encrypt(item.data);

        const decrypted = await decrypt(
          encrypted.encrypted,
          encrypted.salt,
          encrypted.iv
        );

        const isOk = item.data === decrypted.decoded;

        setResult((prev) => [...prev, [encrypted.time, decrypted.time, isOk]]);
      } catch (e) {
        console.error(e);
        // エラー
        setResult((prev) => [...prev, [null, null, false]]);
      }

      // 1秒待機
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsLoading(false);
  };

  return (
    <Box maxW="800px" mx="auto" px="1rem">
      <Heading textAlign="center" my="3rem" size="3xl">
        Web Crypto API AES暗号計測
      </Heading>
      <Button w="100%" my="1rem" onClick={() => void handleClick()}>
        計測
      </Button>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>エンコード時間</Table.ColumnHeader>
            <Table.ColumnHeader>デコード時間</Table.ColumnHeader>
            <Table.ColumnHeader>結果</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {randomDatasets.map((item, i) => {
            const d = result[i] ?? [];

            return (
              <Table.Row key={item.name}>
                <Table.Cell>
                  <ToggleTip content={item.data}>
                    <Text>{item.name}</Text>
                  </ToggleTip>
                </Table.Cell>

                <Table.Cell>
                  <ResultItem e={d[0]} isLoading={isLoading} />
                </Table.Cell>
                <Table.Cell>
                  <ResultItem e={d[1]} isLoading={isLoading} />
                </Table.Cell>
                <Table.Cell>
                  {typeof d[2] === "boolean" ? (
                    d[2] ? (
                      <TbCheck size="20px" />
                    ) : (
                      <TbAlertTriangle size="20px" />
                    )
                  ) : (
                    ""
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

const ResultItem = (props: {
  e: number | undefined | null;
  isLoading: boolean;
}) => {
  if (props.isLoading) {
    if (typeof props.e === "number") {
      return `${props.e.toFixed(3)}ms`;
    } else if (props.e === null) {
      return "-";
    }

    return <Spinner size="sm" />;
  } else {
    if (typeof props.e === "number") {
      return `${props.e.toFixed(3)}ms`;
    }

    return "-";
  }
};

export default App;
