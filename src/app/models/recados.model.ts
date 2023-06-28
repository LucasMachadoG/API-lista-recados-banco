import { v4 as createUuid } from "uuid";

export class Recados {
   private _id: string

   constructor (
      public _descricao: string,
      public _conteudo: string,
      public _arquivada: boolean = false
   ){
      this._id = createUuid()
   }

   public get id () {
      return this._id
   }

   public get descricao() {
      return this._descricao
   }

   public get conteudo() {
      return this._conteudo
   }

   public get arquivada() {
      return this._arquivada
   }

   public set descricao (descricao: string) {
      this._descricao = descricao
   }

   public set conteudo (conteudo: string) {
      this._conteudo = conteudo
   }

   public set arquivada (arquivada: boolean) {
      this._arquivada = arquivada
   }

   public static create (id: string, descricao: string, conteudo: string, arquivada: boolean) {
      const recado = new Recados(descricao, conteudo, arquivada)

      recado._id = id

      return recado
   }

   public toJson(){
      return {
         descricao: this._descricao,
         conteudo: this._conteudo,
         arquivada: this._arquivada, 
         id: this._id
      }
   }
}