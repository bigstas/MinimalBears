          
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
    getInitialState: function () {
        return {
            style: { width: "10%", borderRadius: "20px", transitionDuration: "1s" },
        };
    },
    
    render: function () {
        return (
            <div id="progress">
                <div id="fill" style={this.state.style}></div>
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
            clicked: false,
            currentWordCounter : 0
        };
    },
 
    handleClick: function (e) {
        if (this.props.mode === "ask") {
            this.props.callbackParent();
        }
    },
    
    render: function () {
        var clickedStyle = {backgroundColor: (this.props.feedback === "Correct!") ? "green" : "red" }
        
        /* if (this.state.clicked && (this.state.currentWordCounter < this.props.wordCounter)) {
            this.setState({
                currentWordCounter: this.props.wordCounter,
                clicked: false
            });  
        } */
            
        let unclickedStyle = {
            backgroundColor: "aqua"
        };
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        
        return (
            <div className='option'
            onClick={this.handleClick}
            style={(this.props.mode === "feedback") 
                ? clickedStyle
                : unclickedStyle
            }>
        {/* style={this.props.style}
            > */}
                {text}
            </div>
        );
    }
})


var Arena = React.createClass({
    getInitialState: function () {
        return {
            counter: 0,
            mode: "ask"
        };
    },
    
    mixins: [ParseReact.Mixin], // Enable query subscriptions

    observe: function() {
    // Subscribe to all Comment objects, ordered by creation date
    // The results will be available at this.data.comments
        return {
            word: (new Parse.Query('Language')).ascending('createdAt'),
            item: (new Parse.Query('Item')).ascending('createdAt'),
            sound: (new Parse.Query('Audio')).ascending('createdAt')
        };
    },
    
    onOptionChanged: function () {
        this.setState({
            mode: "feedback"
        });
    },
    
    handleProgressClick: function (e) {
        document.getElementById("button").style.color = "red";

        var snd = new Audio(this.data.sound[0]["File"]["_url"]);
        snd.play();
        
        this.setState({
            mode: "ask",
            counter: this.state.counter +1
        });
        
        var barWidth = document.getElementById("progress").offsetWidth;
        var fillWidth = document.getElementById("fill").offsetWidth;
        if (fillWidth < barWidth -20) {
        // if (fillWidthPercent < 100 ) {
            document.getElementById("fill").style.width = (fillWidth + 10) + 'px';
            //document.getElementById("button").value = toString(this.data.sound);
        };
    },
    
    render: function () {
        var currentWords = [
            ["Moo", "Quack"],
            ["Woof", "Meow"],
            ["Wang", "Gav"]
        ]
        
        var buttonDisabled = (this.state.mode==="ask") ? true : false;
        
        return (
            <div id="arena">
                <p>This is the arena.</p>
                <ProgressBar />
                <ul>
                    {this.data.word.map(function(c) {
                        return <li>{c.Name}</li>;
                    })}
                </ul>
                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                <div className="container">
                    {/* <Option word={currentWords[this.state.counter][0]} feedback="Correct!" />
                    <Option word={currentWords[this.state.counter][1]} feedback="Wrong!" />  */}
                    {this.data.item.map(function(c) {
                        return <Option key={c.id} word={c.Homophones[0]} feedback="Correct!" callbackParent={this.onOptionChanged} mode={this.state.mode} wordCounter={this.state.counter} />
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