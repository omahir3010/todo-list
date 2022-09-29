<template>
  <div class="title has-text-centered">Todo-List📈</div>
  <div class="badass-todo">
    <form @submit.prevent="addTodos">
      <div class="field is-grouped">
        <p class="control is-expanded" :class="{invalid:nameValidity==='Invalid' }">
          <input
            type="text"
            class="input"
            placeholder="Find a Repository"
            v-model.trim="addingInput"
            @blur="validateInput"
          />
        </p>

        <p class="control">
          <button class="button is-info" :disabled="!addingInput">Add➕</button>
        </p>
      </div>
    </form>

    <div class="notificationClass">
      <p v-if="nameValidity==='Invalid'" class="notification is-danger is-light">  Please Enter The List of Your Tasks!!
      </p>
    </div>

    <div
      v-for="todo in visibleTodos"
      :key="todo.id"
      :visibleTodos="visibleTodos"
      :currentPage="currentPage"
      :class="{ 'has-background-success-light': todo.done }"
      class="card"
    >
      <div class="card-image"     v-if="!isLoading">
        <div class="card-content">
          <div class="content">
            <div class="columns is-mobile is-vcentered">
              <div
                class="column"
                :class="{ 'has-text-success line-through': todo.done }"
              >
                {{ todo.context }}
              </div>
              <div class="column">
                <button
                  class="button"
                  :class="todo.done ? 'is-success' : 'is-light'"
                  @click.prevent="toggleDone(todo.id)"
                >
                  &check;
                </button>
                <button
                  class="button is-danger ml-2"
                  @click.prevent="deletingTodo(todo.id)"
                >
                  &cross;
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    
  </div>

<div v-if="totalPages() > 0" class="pagination-wrapper">
  <button v-if="showPreviousLink()" class="button is-primary is-outlined is-small ml-3" @click="updatePage(currentPage -1)">Previous Page</button>
  {{currentPage + 1}} of {{totalPages()}}
  <button v-if="showNextLink()" class="button is-primary is-outlined is-small" @click="updatePage(currentPage +1)">Next page</button>
</div>
</template>

<script>
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,


} from "@firebase/firestore";
import { onMounted } from "vue";

export default {
  data() {
    onMounted(() => {
      this.isLoading=true
      onSnapshot((collection(db,'todos')), (querySnapshot) => {
        this.isLoading=false

        const fbTodos = [];
        querySnapshot.forEach((doc) => {
          const todo = {
            id: doc.id,
            context: doc.data().context,
            done: doc.data().done,
          };
          fbTodos.push(todo);
        });
        this.todos = fbTodos;
        this.updateVisibleTodos();
      });
    });
    return {
      addingInput: "",
      todos: [],
      currentPage: 0,
      pageSize: 3,
      visibleTodos: [],
      clearScreen:false,
      nameValidity:'',
    };
  },

  beforeMount(){
    this.updateVisibleTodos();
  },

  methods: {
    addTodos() {
      addDoc(collection(db, "todos"), {
        context: this.addingInput,
        done: false,
      });
      this.addingInput = "";
      this.updateVisibleTodos();
    },

    deletingTodo(id) {
      deleteDoc(doc(collection(db, "todos"), id));
      this.updateVisibleTodos();
    },
    toggleDone(id) {
      const index = this.todos.findIndex((todo) => todo.id == id);
      updateDoc(doc(collection(db, "todos"), id), {
        done: !this.todos[index].done,
      });
      this.updateVisibleTodos();

    },
    updatePage(pgNum) {
      this.currentPage = pgNum;
      this.updateVisibleTodos();
    },
    totalPages() {
    return Math.ceil(this.todos.length / this.pageSize);
    },
    showPreviousLink() {
      return this.currentPage == 0 ? false : true;
    },

    showNextLink() {
      return this.currentPage == (this.totalPages() - 1) ? false : true;
    },

    updateVisibleTodos() {
      this.visibleTodos = this.todos.slice(
        this.currentPage * this.pageSize,
        (this.currentPage * this.pageSize) + this.pageSize
      );
      if (this.visibleTodos.length === 0 && this.currentPage > 0) {
        this.updatePage(this.currentPage - 1);
      }
    },
    validateInput(){
      if(this.addingInput===''){
        this.nameValidity='Invalid'
      }
      else{
        this.nameValidity='Valid'
      }
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.badass-todo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}

.card-image {
  margin-top: 15px;
}

.line-through {
  text-decoration: line-through;
}
.pagination-btn{
  cursor: pointer;
}
.control.is-expanded{
border-color: red
}

@import "bulma/css/bulma.min.css";
</style>
