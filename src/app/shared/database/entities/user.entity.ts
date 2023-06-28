import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";
import { RecadoEntity } from "./recados.entity";

@Entity({ 
    name: "users", 
})
export class userEntity extends BaseEntity {
    @PrimaryColumn()
      id: string;

    @Column()
    username: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ 
        name: "dthr_criacao" 
    })
    dthrCriacao: Date;

    @UpdateDateColumn({ 
        name: "dthr_atualizacao" 
    })
    dthrAtualizacao: Date;

    @OneToMany(() => RecadoEntity, (recado) => recado.user, {
        eager: true
    })
    recados: RecadoEntity[]
}