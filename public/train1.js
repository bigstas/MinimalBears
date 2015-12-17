          
var Nav = React.createClass({
    render: function () {
        return (
            <div class="nav">
                <div class="container">
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
            <input type="button" id="button" value="Progress" onClick={this.props.handle}></input>
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
        this.setState({
            clicked: true
        });
        //alert("You are clicking me!");
    },
    
    render: function () {
        if (this.props.feedback === "Correct!") {
            var clickedStyle = { backgroundColor: "green" };
        } else {
            var clickedStyle = { backgroundColor: "red" };
        }
            
        let unclickedStyle = {
            backgroundColor: "aqua"
        };
        var text = this.state.clicked ? this.props.feedback : this.props.word;
        
        return (
            <div className='option'
            onClick={this.handleClick}
            style={(this.state.clicked) 
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
    
    handleClick: function (e) {
        document.getElementById("button").style.color = "red";
        //document.getElementById("button").value = this.data.word;

        // var snd = new Audio("Stapler.mp3"); // buffers automatically when created (what does this mean?)
        // snd.play();

        //this.data.sound.equalTo("filename", "stas thing")
        //this.data.sound.find({
        //var Audio = Parse.Object.extend("Audio");
        var query = new Parse.Query("Audio");
        query.equalTo("filename", "stas thing");
        query.first({
            success: function (object) {
                alert("Successfully retrieved " + object);
                var snd = new Audio(object.File);
                snd.play();
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            } 
        });
        //var snd = new Audio(this.data.sound[0].File)
        //snd.play()
        
        this.setState({
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
        
        return (
            <div id="arena">
                <p>This is the arena.</p>
                <p>{this.data.sound[0]}</p>
                <ProgressBar />
                <ul>
                    {this.data.word.map(function(c) {
                        return <li>{c.Name}</li>;
                    })}
                </ul>
                <Button handle={this.handleClick} />
                <div class="container">
                    {/* <Option word={currentWords[this.state.counter][0]} feedback="Correct!" />
                    <Option word={currentWords[this.state.counter][1]} feedback="Wrong!" />  */}
                    {this.data.item.map(function(c) {
                        return <Option word={c.Homophones[0]} feedback="Correct!" />
                    })}
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