/* cumstom decorator를 만들어서 
REST API의 request에서 user를 쉽게 뽑아낼 것임
이거 왜 하느냐구? Task 로 돌아가서 session처럼 수정하거나 이런거 할 때
user 장보를 줘서 권한을 주는 거야
이거 하려면 taskmodule에 authmodule을 불러와야겠지 */

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../entity/user.entity";

export const GetUser = createParamDecorator( (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})