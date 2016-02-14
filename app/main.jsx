// Define a collection to hold our tasks
Tasks = new Mongo.Collection("tasks");


// Combine navigation bar and 'arena', to produce whole app
FullContent = React.createClass({
    getInitialState() {
        return {
            active: 0
        }
    },
    
    handleNavClick(id) {
        this.setState({
            active: id
        })
    },
    
    render() {
        return (
            <div id="outerDiv">
                <Nav active={this.state.active} callbackParent={this.handleNavClick} />
            
                {this.state.active === 1 ? <Arena /> : []}
            {/* {this.state.active === 2 ? <Record /> : []} */}
                {this.state.active === 3 ? <About /> : []}
                {this.state.active === 5 ? <Profile /> : []}
            </div>
        )
    }
});


// Run the app!
if (Meteor.isClient) {
    // This code is executed on the client only
 
    Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
        ReactDOM.render(<FullContent />, document.getElementById("content"));
    });
}


// The below is kept for reference as an example of how to use Meteor with React, as we build the project.
/*
App = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],
 
    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch()
        }
    },
 
    renderTasks() {
        // Get tasks from this.data.tasks
        return this.data.tasks.map((task) => {
            return <Task key={task._id} task={task} />;
        });
    },
    
    handleSubmit(event) {
        event.preventDefault();
 
        // Find the text field via the React ref
        var text = React.findDOMNode(this.refs.textInput).value.trim();
 
        Tasks.insert({
            text: text,
            createdAt: new Date() // current time
        });
 
        // Clear form
        React.findDOMNode(this.refs.textInput).value = "";
    },
 
    render() {
        return (
            <div className="container">
                <Nav active={1} callbackParent={myFunc} />
                <header>
                    <h1>Todo List</h1>
                    
                    <form className="new-task" onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Type to add new tasks" />
                    </form>
                </header>
 
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
});
*/