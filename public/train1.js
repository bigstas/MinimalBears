

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

var OptionStyle = {
    height: "40px",
    width: "60px",
    textAlign: "center",
    backgroundColor: "aqua",
    color: "white",
    float: "{this.props.float}"
}

var LeftOption = React.createClass({
    render: function () {
        return (
            <div style={OptionStyle}>
                Moo
            </div>
        );
    }
})

var RightOption = React.createClass({
    render: function () {
        return (
            <div style={OptionStyle}>
                Quack
            </div>
        );
    }
})


var Arena = React.createClass({
    mixins: [ParseReact.Mixin], // Enable query subscriptions

    observe: function() {
    // Subscribe to all Comment objects, ordered by creation date
    // The results will be available at this.data.comments
        return {
            word: (new Parse.Query('Language')).ascending('createdAt'),
            sound: (new Parse.Query('Audio'))
        };
    },
    
    handleClick: function (e) {
        document.getElementById("button").style.color = "red";
        //document.getElementById("button").value = this.data.word;

        var snd = new Audio("Stapler.mp3"); // buffers automatically when created (what does this mean?)
        snd.play();

        
        //var barWidth = document.getElementById("progress").offsetWidth;
        var fillWidthPercent = document.getElementById("fill").style.width.replace(/[^0-9]/g, '');
        //if (fillWidth < barWidth -20) {
        if (fillWidthPercent < 100 ) {
            document.getElementById("fill").style.width = (fillWidthPercent + 10) + '%';
            document.getElementById("button").value = toString(this.data.sound);
        };
    },
    
    render: function () {
        return (
            <div id="arena">
                <p>This is the arena.</p>
                <ProgressBar />
                <ul>
                    {this.data.word.map(function(c) {
                        return <li>{c.Name}</li>;
                    })}
                </ul>
                <Button handle={this.handleClick} />
                <LeftOption float="left" />
                <RightOption float="right" />
            </div>
        );
    }
})


ReactDOM.render(
    <Arena />,
    document.getElementById('content')
);