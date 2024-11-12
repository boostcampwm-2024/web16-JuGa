export class StockResponseDto {
  code: string;
  name: string;
  market: string;

  constructor(code: string, name: string, market: string) {
    this.code = code;
    this.name = name;
    this.market = market;
  }
}
