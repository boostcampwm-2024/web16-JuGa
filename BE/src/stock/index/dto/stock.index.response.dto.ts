import {StockIndexListElementDto} from "./stock.index.list.element.dto";
import {StockIndexValueElementDto} from "./stock.index.value.element.dto";
import {ApiProperty} from "@nestjs/swagger";

export class StockIndexResponseDto {
  @ApiProperty({ description: '주가 지수 차트 정보 (코스피, 코스닥)', type: [StockIndexListElementDto] })
  indexList: StockIndexListElementDto[];

  @ApiProperty({ description: '주가 지수 실시간 값 정보 (코스피, 코스닥)', type: [StockIndexValueElementDto] })
  indexValue: StockIndexValueElementDto[];
}