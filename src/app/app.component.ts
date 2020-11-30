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
  headerText: string = '';
  isSubTask: boolean = false;

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
          this.getAllTodos();
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
        this.resetUI();
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
          this.resetUI();
        } else {
          this.showError("Error while updating", '404')
        }
        console.log(this.todos[data.data.updateList.position])
      });
    } else {
      alert("Something is wrong")
    }

  }

  onCreateSubTask(todo: any) {
    console.log(todo);
    this.isSubTask = true;
    this.headerText = todo.name;
    this.todoId = todo.id;
  }

  createSubTask() {
    console.log("Creating a subatask")
    if (this.isSubTask) {
      this.service.createNewSubTask(this.todoId, this.todoTitle, this.todoDesc).subscribe(data => {
        console.log("created sub task", data.data);
        this.getAllTodos();
      });
    }

  }

  onDeleteSubTask(id: any) {
    console.log("deleting Subatsk", id)
    if (confirm("Are you sure want to delete subtask?")) {
      if (id > 0) {
        this.service.deleteSubTask(id).subscribe(data => {
          console.log(data.data);
          if (data.data.deleteItem) {
            this.showSuccess("Subccessfully Deleted SubTask", 'Deleted!');
            this.getAllTodos();
          } else {
            this.showError("Error in deleting Subtask", "Failed!");
          }
        });
      }
    }

  }

  resetUI() {
    this.isSubTask = false;
    this.isUpdate = false;
    this.todoId = 0;
    this.todoTitle = '';
    this.todoDesc = '';
    this.headerText = '';
  }

  showSuccess(message: string, desc: string) {
    this.toastr.success(message, desc, {
      timeOut: 1000,
    });
  }

  showError(message: string, desc: string) {
    this.toastr.error(message, desc, {
      timeOut: 1000,
    });
  }

}
