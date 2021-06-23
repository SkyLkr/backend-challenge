import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./User";

@Entity()
export class Summoner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ unique: true })
  accountId: string;

  @Column()
  summonerLevel: string;

  @Column()
  profileIconId: string;

  @Column({ unique: true })
  summonerId: string;

  @ManyToOne(() => User)
  user: User;
}