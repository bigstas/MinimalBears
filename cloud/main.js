/*
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world! This is STAS");
});

var CommentBlock = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions 
 
  observe: function() {
    // Subscribe to all Comment objects, ordered by creation date 
    // The results will be available at this.data.comments 
    return {
      comments: (new Parse.Query('Comment')).ascending('createdAt')
    };
  },
 
  render: function() {
    // Render the text of each comment as a list item 
    return (
      <ul>
        {this.data.comments.map(function(c) {
          return <li>{c.text}</li>;
        })}
      </ul>
    );
  }
}); */


/*

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


var Arena = React.createClass({
    handleClick: function (e) {
        document.getElementById("button").style.color = "red";
        
        //var barWidth = document.getElementById("progress").offsetWidth;
        var fillWidthPercent = document.getElementById("fill").style.width.replace(/[^0-9]/g, '');
        //if (fillWidth < barWidth -20) {
        if (fillWidthPercent < 100 ) {
            document.getElementById("fill").style.width = (fillWidthPercent + 10) + '%';
            document.getElementById("button").value = fillWidthPercent;
        };
    },
    
    render: function () {
        return (
            <div id="arena">
                <p>This is the arena.</p>
                <ProgressBar />
                <Button handle={this.handleClick}/>
            </div>
        );
    }
})


ReactDOM.render(
    <Arena />,
    document.getElementById('content')
);

*/