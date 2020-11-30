import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { ToastrService } from 'ngx-toastr'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'leanix-angular';
  todoId: Number = 0;
  todoTitle: string = '';
  todoDesc: string = '';
  isUpdate: boolean = false;
  todos: any[];
  constructor(private http: HttpClient, private service: TodoService, private toastr: ToastrService) {

  }
  ngOnInit() {
    this.getAllTodos();
  }

  getAllTodos() {
    this.service.getAllTodos().subscribe(data => {
      this.todos = data.data.lists;
      console.log("Angular Response", this.todos);
    });
  }

  onToDoUpdate(todo: any) {
    this.isUpdate = true;
    console.log("Card Clicked ", todo);
    this.todoId = todo.id;
    this.todoTitle = todo.name;
    this.todoDesc = todo.description;
  }

  onToDoDelete(todo: any) {
    if (confirm("Are you sure want to delete, " + todo.name + " ?")) {
      this.service.deleteATodo(todo.id).subscribe(data => {
        console.log(data.data.deleteList);
        if (data.data.deleteList) {
          this.showSuccess("Successfully Deleted", todo.name);
          this.getAllTodos()
        }
      })
    }
  }

  createToDo() {

    if (!this.isUpdate) {
      console.log("creating a ToDo", this.todoTitle, this.todoDesc);
      this.service.createNewToDo(this.todoTitle, this.todoDesc).subscribe(data => {
        this.todos.push(data.data.createList);
        this.showSuccess('Successfully Added', data.data.createList.name);
      });
    } else {
      this.showError("Error while updating", '404')
      alert("something is wrong")
    }

  }

  updateToDo() {
    if (this.isUpdate) {
      console.log("updating a ToDo", this.todoId, this.todoTitle, this.todoDesc);
      this.service.updateToDoInfo(this.todoId, this.todoTitle, this.todoDesc).subscribe(data => {
        console.log("update response is", data.data);
        if (data.data.updateList.id > 0) {
          this.todos[data.data.updateList.position].name = data.data.updateList.name;
          this.todos[data.data.updateList.position].description = data.data.updateList.description;
          this.showSuccess('Successfully Updates', data.data.updateList.name);
        } else {
          this.showError("Error while updating", '404')
        }
        console.log(this.todos[data.data.updateList.position])
      });
    } else {
      alert("Something is wrong")
    }
  }


  showSuccess(message: string, desc: string) {
    this.toastr.success(message, desc, {
      timeOut: 3000,
    });
  }

  showError(message: string, desc: string) {
    this.toastr.error(message, desc, {
      timeOut: 3000,
    });
  }

}
