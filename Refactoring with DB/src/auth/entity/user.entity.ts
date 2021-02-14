import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import * as bcrypt from 'bcrypt';
import { Task } from '../../tasks/entity/task.entity';

/* 이렇게 하고 첫 번째 행을 넣으면 알아서 postgre에 User 테이블이 만들어짐
pgAdmin에서 확인 가능 */
@Entity()
/* 이 Array 안에 들어가는 column들은 unique 속성을 가짐 */
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    /* 여기서 오류 발생하면 어케하지? */

    @Column()
    password: string;
    
    /* Password뿐만 아니라 Salt도 넣어주자. */
    @Column()
    salt: string;
    
    /* Relation: 2개 이상의 DB 테이블의 관계
    각각의 공통 field을 기반으로 ==> MySQL의 foreign key 하는 것임
    one-to-one은 primiary tabel row랑 다른 row랑 1대1
    one-to-many는 pr row가 다른 table의 여러 row랑 */
    @OneToMany(type => Task, task => task.user, {eager:true})
    /* OneToMany는 2개의 함수를 arg로 갖는다.
    (type) => {return Task}와 같은 것 
    eager: true, user(PT)가 retrieve될때마다 Task도 같이 옴 */
    tasks: Task[];

    /* Entity에는 이것처럼 Method도 있을 수 있다. */
    async validatePassword(password: string): Promise<boolean> {
        /* 여기서 this.salt는 바로 위의 salt column에 들어있는
        한 user의 unique한 salt */
        const hash = await bcrypt.hash(password, this.salt);
        /* this.password도 마찬가지 */
        return hash === this.password;
    }
}