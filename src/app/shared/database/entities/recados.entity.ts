import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { userEntity } from "./user.entity";

@Entity({
    name: "recados"
})
export class RecadoEntity extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column() 
    descricao: string 

    @Column()
    conteudo: string

    @Column({
        default: false
    })
    arquivada: boolean

    @CreateDateColumn({
        name: "dthr_criacao"
    })
    dthrCriacao: Date

    @UpdateDateColumn({
        name: "dthr_atualizacao"
    })
    dthrAtualizacao: Date

    @Column({
        name: "id_user"
    })
    idUser: string

    @ManyToOne(() => userEntity, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "id_user"
    })
    user: userEntity
}