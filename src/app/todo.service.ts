import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }

  getAllTodos() {
    const body = `query{
      lists {
        id
        name
        description
        position
        items{
        id
          name
          description
          position
          listId
      }
  }
}`;
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

  updateToDoInfo(id: Number, title: string, desc: string) {
    const body = `mutation {
      updateList(id:"`+ id + `",name:"` + title + `",description:"` + desc + `"){
        id
        name
        description
        position
      }
  }`;
    console.log("req ", body.toString())
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

  createNewToDo(title: string, desc: string) {
    const body = `mutation {
      createList(name:"`+ title + `",description:"` + desc + `"){
        id
        name
        description
        position
      }
  }`;
    console.log("req ", body.toString())
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

  deleteATodo(id: Number) {
    const body = `mutation {
      deleteList(id:`+ id + `)
   }`;
    console.log("req ", body.toString())
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

  createNewSubTask(todoId: Number, title: string, desc: string) {
    const body = `mutation{
  createItem(input:{name:"`+ title + `",description:"` + desc + `",listId:` + todoId + `}){
    id
    name
    listId
    position
  }
}`;
    console.log("req ", body.toString())
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

  deleteSubTask(id: any) {
    const body = `mutation{
      deleteItem(id:`+ id + `)
  }`;
    console.log("req ", body.toString())
    return this.http.post<any>('http://localhost:8080/rest/lists/', body);
  }

}
