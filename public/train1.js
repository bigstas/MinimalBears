
var Nav = React.createClass({
    render: function () {
        return (
            <div className="nav">
                <div className="container">
                    <ul>
                        <li><a href="#">Logo</a></li>
                        <li><a href="#">Train</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Sign Up</a></li>
                        <li><a href="#">Log In</a></li>
                        <li><a href="#">About</a></li>
                    </ul>
                </div>
            </div>
        );
    }
})
          

var ProgressBar = React.createClass({
    render: function () {
        return (
            <div id="progress">
                <div id="fill" style={this.props.style}></div>
            </div>
        );
    }
})


var Button = React.createClass({    
    render: function () {
        return (
            <input type="button" id="button" value="Progress" disabled={this.props.disabled} onClick={this.props.handle}></input>
        );
    }
})

Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');


var Option = React.createClass({
    getInitialState: function () {
        return {
            clicked: false
        };
    },
 
    handleClick: function (e) {
        if (this.props.mode === "ask") {
            this.props.callbackParent();
        }
    },
    
    render: function () {
        var clickedStyle = {backgroundColor: (this.props.feedback === "Correct!") ? "green" : "red" }
        var unclickedStyle = { backgroundColor: "aqua" };
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        
        return (
            <div className='option'
            onClick={this.handleClick}
            style={(this.props.mode === "feedback") 
                ? clickedStyle
                : unclickedStyle
            }>
                {text}
            </div>
        );
    }
})


var Arena = React.createClass({
    getInitialState: function () {
        return {
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "ask"
        };
    },
    
    mixins: [ParseReact.Mixin], // Enable query subscriptions

    observe: function() {
        return {
            item: (new Parse.Query('Item')).ascending('createdAt'),
            sound: (new Parse.Query('Audio')).ascending('createdAt')
        };
    },
    
    onOptionChanged: function () {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        });
    },
    
    handleProgressClick: function (e) {
        this.setState({
            mode: "ask", 
            selection: Math.floor(Math.random() * this.data.sound.length)
        });
        var snd = new Audio(this.data.sound[this.state.selection]["File"]["_url"]);
        snd.play();
    },
    
    render: function () {
        var buttonDisabled = (this.state.mode==="ask" || this.state.counter === this.state.maxRounds) ? true : false;
        
        return (
            <div id="arena">
                <p>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />
                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                <div className="container">
                    {this.data.item.map(function(c) {
                        console.log(this.data.sound[this.state.selection]["spoken"]);
                        var theFeedback = (c.Homophones[0]==this.data.sound[this.state.selection]["spoken"] ? "Correct!" : "Wrong!");
                        return <Option key={c.id} word={c.Homophones[0]} feedback={theFeedback} callbackParent={this.onOptionChanged} mode={this.state.mode} />
                    }, this) }
                </div>
            </div>
        );
    }
})


var FullContent = React.createClass({
    render: function () {
        return (
            <div id="outerDiv">
                <Nav />
                <Arena />
            </div>
        )
    }
})


ReactDOM.render(
    <FullContent />,
    document.getElementById('content')
);