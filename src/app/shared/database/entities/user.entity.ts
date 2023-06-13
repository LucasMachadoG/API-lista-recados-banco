import { BaseEntity, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { recadoEntity } from './recado.entity';
//O model do back-end eh a nossa classe user, ja o model do nosso banco de dados vai ser a nossa classe entity
//Toda tabela de um banco de dados relacional tem que ter uma PK
//Se colocarmos uma coluna normal, o typeorm vai entender que ela eh uma coluna obrigatoria
//Entidade eh oq mapeia o back end para o banco de dados

// Para se usar o Typeorm como um active record nos devemos extender a nossa classe

@Entity({
    name: 'user',
    schema: 'trabalho'
})
export class userEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 30
    })
    public username: string;

    @Column()
    public email: string;

    @Column({
        length: 30
    })
    public password: string;

    @Column ({
        name: "dthr_atualizacao",
        type: "timestamp"
    }) 
    public dthratualizacao: Date

    // Esse eager serve para que toda vez que um user for consultado pelo banco de dados, o typeorm vai automaticamente buscar esse relacionamento
    // Mesmo sem colocar o relations
    // Nos podemos fazer o inverso tambem
    @OneToMany(() => recadoEntity, (recado) => recado.user, {
        eager: true
    })
    recados: recadoEntity[]

    // O beforeupdate so vai funcionar se nos utilizar o safe
    // @BeforeUpdate()
    // beforeUpdate () {
    //     this.dthratualizacao = new Date
    // }
}