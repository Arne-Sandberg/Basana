import React from 'react';
import { minDate } from '../../../util/date_util';
import TaskOptionDropdown from './task_option_dropdown_container';
import DropdownButton from '../../button/dropdown_button';
import Assignee from './assignee';
import AssignedProject from './assigned_project';
import TaskCompletionButton from '../../button/task_completion_button';
import TaskLikeButton from '../../button/task_like_button';
import CommentIndexContainer from '../../comment/comment_index_container';
import CreateCommentFormContainer from '../../comment/create_comment_form_container';

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
  }

  handleClick() {
    return () => {
      const { history, location, closeModal } = this.props;
      closeModal();
      history.push(`${/(^.*)\/tasks/.exec(location.pathname)[1]}`);
    };
  }

  update(field) {
    const {
      task,
      updateTask,
      updateReduxTask
    } = this.props;

    return (e) => {
      const tobeUpdate = e.currentTarget.value;
      updateReduxTask({id: task.id, [field]: tobeUpdate});

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        updateTask(this.props.task);
        this.timeout = null;
      }, 1000);
    };
  }

  render() {
    const { task, errors, match, assignee, project, updateTask } = this.props;
    const { taskId } = match.params;

    return (
      <div className='task-edit' id='task-form-container'>
        <div className='task-form'>
          <span
            onClick={this.handleClick()}
            className='component-close'>&times;</span>
          <div className='assignee_and_due_date'>
            <Assignee
              assignee={ assignee }
              task={ task }
              updateTask={ updateTask }/>

            <div className='task-due-date'>
              <input
                id='task-due-date-input'
                type='date'
                min={ minDate() }
                onChange={ this.update('due_date') }
                value={ task ? task.due_date : ''}/>
            </div>

            <ul className='task-option'>
              <li>
                <TaskLikeButton task={ task }/>
              </li>

              <li>
                <DropdownButton
                  dropdown={ () => <TaskOptionDropdown task={task}/>}
                  buttonStyle={ () => <span>...</span> }
                  type="task"/>
              </li>
            </ul>
          </div>


          <div className='name_and_description'>
            <AssignedProject
              project={ project }
              task={ task }
              updateTask={ updateTask }/>

            <div className='task-name'>
              <TaskCompletionButton
                task={ task }
                updateTask={ updateTask }/>

              <input
                id='task-name-input'
                type='text'
                placeholder='Write a task name'
                onChange={ this.update('name') }
                value={ task ? task.name : '' }/>
            </div>

            <div className='task-description'>
              <svg viewBox="0 0 32 32">
                <path d="M26,8H2V6h24V8z M22,12H2v2h20V12z M28,18H2v2h26V18z M24,24H2v2h22V24z"/>
              </svg>

              <textarea
                id='task-description-input'
                type='text'
                placeholder='Description'
                onChange={ this.update('description') }
                value={ task ? task.description : '' }/>

              <ul>
                { errors.map(error => <li>{error}</li>) }
              </ul>
            </div>
          </div>
        </div>

        <CommentIndexContainer taskId={taskId}/>
        <CreateCommentFormContainer taskId={taskId}/>
      </div>
    );
  }
}

export default TaskForm;
