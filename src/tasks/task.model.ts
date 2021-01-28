export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
}

/* TypeScript Enum: 추상화의 수단

다국어 지원을 위해 언어 코드를 저장할 변수를 만든다고 하자.
const code: string = "en";

(보완)
언어가 수십개가 있는데, 얘를 전부 string으로 구분하는 것은 범위가 넓다.
type LanguageCode = "ko" | "en" |  "ja" | "zh" | "es";
const code: LanguageCode = 'ko';

(문제)
LanguageCode에 어떤 언어들이 있었는지도 가물가물하고, 'ja', 'zh', 'es'가 
어떤 언어를 가르키는지도 기억이 안난다.

const korean = 'ko';
const english = 'en'; ... 처럼 상수를 지정할 수 있지만
이러면 LanguageCoded의 code들과 중복된다.

이때 enum으로 리터럴의 타입과 값에 이름을 붙여 코드 가독성을 높일 수 있다.

export enum LanguageCode {
    korean = 'ko',
    english = 'en',
    japanese= 'ja',
    ...
}
(의미)
LanguageCode.korean = 'ko'
LanguageCode === 'ko' | 'en' | 'ja' | 'zh' | 'es'
const code: LanguageCode = LanguageCode.korean

Object와의 차이:
1. 속성 변경/추가 불가
2. 속성 문자열, 숫자만 가능
*/

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = ' ',
    DONE = 'DONE'
}