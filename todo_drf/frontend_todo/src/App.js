import React, { Component } from 'react';
import './App.css';

 class App extends Component {

  constructor(props){
    super(props);

    this.state={
      todoList:[],
      activeItem:{  // to hold item when click on editing
        id:null,
        title:'',
        completed:false,
      },
      editing:false,  //to check if we are editing or adding new item
    }
    this.fetchTasks=this.fetchTasks.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.deleteItem=this.deleteItem.bind(this)
    this.startEdit=this.startEdit.bind(this)
    this.strikeUnStrike=this.strikeUnStrike.bind(this)

  };

  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    console.log("fetch")
    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(response=>response.json())
    .then(data=>
        this.setState({
          todoList:data
        })
      )
  }

  handleChange=(e)=>{
    var name=e.target.value
    var value=e.target.value

    console.log(name+"  "+value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    console.log(this.state.activeItem)

    var url='http://127.0.0.1:8000/api/task-create/'

    if(this.state.editing==true){
      url=`http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }

    fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)=>{
      this.fetchTasks()
      this.setState({
        activeItem:{  // to hold item when click on editing
          id:null,
          title:'',
          completed:false,
        },
      })
    }).catch((err)=>{
      console.log('error',err)
    })
  }

  startEdit=(task)=>{
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem=(task)=>{
    var url=`http://127.0.0.1:8000/api/task-delete/${task.id}/`
    fetch(url,{
      method:'DELETE',
      headers:{
       'Content-type':'application/json'
      },
    }).then((response)=>{
      this.fetchTasks()
    })
  }

  strikeUnStrike=(task)=>{
    task.completed=!task.completed
    var url= `http://127.0.0.1:8000/api/task-update/${task.id}/`
    fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify({'completed':task.completed , 'title':task.title})
    }).then((response)=>{
      this.fetchTasks()
    })

    console.log(task.completed)
  }

  render() {
    var tasks=this.state.todoList
    var self=this
    return (
      <div className="container">
          <div id="task-container">
              <div id="form-wrapper">
                <form id="form" onSubmit={this.handleSubmit}>
                  <div className="flex-wrapper">
                    <div style={{flex:6}}>
                      <input onChange={this.handleChange} value={this.state.activeItem.title} className="form-control" id="title" name="title" type="text"  placeholder="Add Task..." />
                    </div>

                    <div style={{flex:1}}>
                      <input id="submit" className="btn btn-warning " name="submit" type="submit" />
                    </div>
                  </div>
                </form>
              </div>

              <div id="list-wrapper">

                  {
                    tasks.map(function(task,index){
                      return(
                        <div key={index} className="task-wrapper flex-wrapper" >
                            <div onClick={()=>self.strikeUnStrike(task)} style={{flex:7}}>
                              {
                                task.completed==false ? (
                                  <span>{task.title}</span>
                                ):(
                                  <strike>{task.title}</strike>
                                )
                              }
                            </div>
                            <div style={{flex:1}}>
                              <button onClick={()=>self.startEdit(task)} className="btn btn-sm btn-warning">
                                Edit
                              </button>
                            </div>
                            <div style={{flex:1}}>
                            <button onClick={()=>self.deleteItem(task)} className="btn btn-sm btn-danger">
                                -
                              </button>
                            </div>
                        </div>
                      )
                    })
                  }
              </div>
          </div>
        
      </div>
    )
  }
}

export default App;