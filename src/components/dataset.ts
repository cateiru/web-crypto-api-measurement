type DatasetItem = {
  name: string;
  data: string;
};

export const DATASET: DatasetItem[] = [
  {
    name: "default",
    data: "hello world",
  },
  {
    name: "日本語",
    data: "こんにちは",
  },
  {
    name: "1000文字アルファベット",
    data: Array(1000).fill("a").join(""),
  },
  {
    name: "emoji",
    data: "🍣🍺🍵🍶🍷🍸",
  },
  {
    name: "1000文字日本語",
    data: Array(1000).fill("あ").join(""),
  },
  {
    name: "日本語長文",
    data: "昔々、あるところにおじいさんとおばあさんが住んでいました。おじいさんは山へ芝刈りに、おばあさんは川へ洗濯に行きました。おばあさんが川で洗濯をしていると、大きな桃が流れてきました。おばあさんはその桃を家に持ち帰り、二人で食べようとしました。すると、桃の中から元気な男の子が飛び出してきました。二人はその子を桃太郎と名付け、大切に育てました。",
  },
];
