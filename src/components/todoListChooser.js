// @flow
import React, { useState } from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Tooltip from "@material-ui/core/Tooltip"
import ViewArrayIcon from "@material-ui/icons/ViewArray"
import { makeStyles } from "@material-ui/styles"

import TodoListModel from "../models/todoList"

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    }
  }
})

type Props = {
  todoLists: Array<TodoListModel>,
  onSelectTodoList: (todoList: TodoListModel) => void
}

const TodoListSelection = props => (
  <ListItem key={props.uuid} button onClick={props.onClick}>
    <ListItemText primary={props.name} />
  </ListItem>
)

const Chooser = (props: Props) => {
  const classes = useStyles()
  console.log("classes = ", classes)
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const onSelectList = (l: TodoListModel) => {
    toggleOpen()
    props.onSelectTodoList(l)
  }

  return (
    <React.Fragment>
      <Tooltip title="Choose todolist">
        <IconButton className={classes.icon} onClick={toggleOpen}>
          <ViewArrayIcon />
        </IconButton>
      </Tooltip>
      <Dialog onClose={toggleOpen} open={isOpen}>
        <DialogTitle>Choose Todolist</DialogTitle>
        <List>
          {props.todoLists.map(l => (
            <TodoListSelection
              name={l.name}
              uuid={l.uuid}
              onClick={onSelectList.bind(this, l)}
            />
          ))}
        </List>
      </Dialog>
    </React.Fragment>
  )
}

export default Chooser
