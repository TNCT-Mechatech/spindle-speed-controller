# Protocol Definition

## 設定

- ボーレート: 9600

## データフレーム

```text
| start | data ... | end |
```

## 制御文字

データの開始は、セミコロン`; (0x3b)`で表現されます。  
データの終了は、改行コード`\n (0x0a)`で表現されます。

## 制約

送信の際は、200ms以上の遅延を設けてください。

## コマンド

マイコンへの通信のみコマンドを使用できます。

### ステータス取得

`STATUS`

#### レスポンス

`<STATE> <DIRECTON> <TARGET_SPEED> <SPEED> <POWER>`

- STATE: `STOP` or `RUN` or `EMERG` or `ERROR`
- DIRECTION: `F`(forward) or `R`(reverse)
- TARGET_SPEED: unsigned number
- SPEED: unsigned number
- POWER: unsigned number

### 主軸目標設定

`TARGET <DIRECTION> <SPEED>`

- DIRECTION: `F`(forward) or `R`(reverse)
- SPEED: unsigned number

### 主軸回転

`START`

### 主軸停止

`STOP`

### 緊急停止

`EMERG`