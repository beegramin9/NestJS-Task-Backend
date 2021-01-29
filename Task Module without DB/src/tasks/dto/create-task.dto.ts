/* Interface는 TypeScript의 속성이라 컴파일할때만 인식되고
코드 짤 때는 인식이 안되어서 Class로 하는 게 맞다. */
import { IsNotEmpty } from 'class-validator';
/* class-validator와 class-transformer 둘 다 설치해야 함 */

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
}