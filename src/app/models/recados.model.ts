import { v4 as createUuid } from "uuid";
import { user } from "./user.models";

export class Recados {
   private _id: string
   private _arquivada: boolean

   constructor (
      private _nome: string,
      private _descricao: string,
      private _conteudo: string
   ){
      this._id = createUuid()
      this._arquivada = false
   }

   public get id () {
      return this._id
   }

   public get nome () {
      return this._nome
   }

   public set descricao (descricao: string) {
      this._descricao = descricao
   }

   public set conteudo (conteudo: string) {
      this._conteudo = conteudo
   }

   public static create (id: string, nome: string, descricao: string, conteudo: string) {
      const recado = new Recados(nome, descricao, conteudo)

      recado._id = id

      return recado
   }

   public toJson () {
      return {
         nome: this._nome,
         descricao: this._descricao,
         conteudo: this._conteudo,
         arquivada: this._arquivada, 
         id: this._id
      }
   }
}