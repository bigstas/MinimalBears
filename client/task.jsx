// This will be removed in time.
// It's from the Todo List tutorial.
// For the moment it serves as another example of how to use Meteor with React.

// Task component - represents a single todo item
Task = React.createClass({
    propTypes: {
        // This component gets the task to display through a React prop.
        // We can use propTypes to indicate it is required
        task: React.PropTypes.object.isRequired
    },
    
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Tasks.update(this.props.task._id, {
            $set: {checked: ! this.props.task.checked}
        });
    },
 
    deleteThisTask() {
        Tasks.remove(this.props.task._id);
    },
    
    render() {
        // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? "checked" : "";
 
    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
            &times;
        </button>
 
        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />
 
        <span className="text">{this.props.task.text}</span>
      </li>
        );
    }
});