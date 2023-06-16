import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { userEntity } from "./user.entity";

@Entity({
    name: "recado",
    schema: "trabalho"
})
export class recadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: "text"
    })
    descricao: string

    @Column({
        type: "text"
    })
    conteudo: string

    @Column()
    arquivada: boolean

    @Column({
        name: "id_user"
    })
    idUser: string

    @CreateDateColumn({
        name: "dthr_criacao"
    })
    dthrcriacao: Date

    @UpdateDateColumn({
        name: "dthr_atualizacao"
    })
    dthratualizacao: Date

    // Aqui nos estamos fazendo um relacionamento entre duas entidades
    @ManyToOne(() => userEntity)
    @JoinColumn({
        name: "id_user"
    })
    user: userEntity
}