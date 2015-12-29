
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


var WordOption = React.createClass({
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
        var unclickedStyle = { backgroundColor: "#b0b0e0" };
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        
        return (
            <div className='wordOption'
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


/* var EmptyArray = {
    subscribers: {},
    observerCount: 0,
    
    subscibe: function(callbacks) {
        var observerId = 'o' + this.observerCount++;
        this.subscibers[observerId] = callbacks;
        callbacks.OnNext([]);
        
        return {
            dispose: () => {
                delete this.subscibers[observerId];
            }
        }
    },
    
    update: function(changes) {
        for (var oid in this.subscibers) {
            this.subscibers[oid].onNext([]);
        }
    }
}; */


var Arena = React.createClass({
    getInitialState: function () {
        return {
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "ask",
            activeLanguageId: null,
            activeContrast: null
        };
    },
    
    mixins: [ParseReact.Mixin], // Enable query subscriptions

    observe: function(props, state) {
        /* q.equalTo('practice_session', Parse.Object('_PracticeSession',
  { id: this.props.practice_session.objectId }));
        var Guy = new Parse.Object('Language', {id: this.state.activeLanguageId});
        console.log(Guy); */
        
        var subs = {
            languages: (new Parse.Query('Language')).ascending('createdAt'),
            //activeLanguage: (new Parse.Query('Language')).equalTo('Name',this.state.activeLanguage),
            items: (new Parse.Query('Item')).ascending('createdAt'),
            sounds: (new Parse.Query('Audio')).ascending('createdAt')
        };
        
        if (this.state.activeLanguageId) {
            subs.contrasts = (new Parse.Query('Contrast')).equalTo('Language', new Parse.Object('Language', {id: this.state.activeLanguageId}));
        } 
        
        return subs;
    },
    
    handleLanguageChange: function() {
        this.setState({
            activeLanguageId: document.getElementById("chooseLanguage").value,
            activeContrast: null,    // need to reset contrasts when language changes
            isLoading: true
        });
        //this.refreshQueries(["contrasts"])
    },
    
    handleContrastChange: function () {
        this.setState({
            activeContrast: document.getElementById("chooseContrast").value
        });
    },
    
    onWordChosen: function () {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        });
    },
    
    handleProgressClick: function () {
        this.setState({
            mode: "ask", 
            selection: Math.floor(Math.random() * this.data.sounds.length)
        });
        var snd = new Audio(this.data.sounds[this.state.selection]["File"]["_url"]);
        snd.play();
        console.log(this.data.activeLanguage[0]["Contrasts"]);
    },
    
    componentDidUpdate: function (props, state) {
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    },
    
    render: function () {
        var buttonDisabled = (this.state.mode==="ask" || this.state.counter === this.state.maxRounds) ? true : false;
        var contrastOptions = null
        
        
        console.log(this.pendingQueries())
        
        try {
            contrastOptions = this.data.contrasts.map(function(c) {
                return <option value={c.objectId}>{c.Name}</option>
            })
        } catch(e) {
            contrastOptions = []
        }
            
        
        return (
            <div id="arena">
                <select id="chooseLanguage" onChange={this.handleLanguageChange}>
                    {this.data.languages.map(function(c) {
                        
                        return <option value={c.objectId}>{c.Name}</option>
                    })}
                </select>
                <select>
                    {contrastOptions}
    {/*             {this.state.contrastList.map(function(c) {
                    return <option value={c.objectId}>{c.Name}</option>  */}
                    
                </select>
 {/*               <select id="chooseContrast" onChange={this.handleContrastChange}>
                    {this.data.activeLanguage[0]['Contrasts'].map(function(c) {
                            return <option value={c.Name}>{c.Name}</option>
                        })}     */}
{/*                    <option value="contrast">Contrast</option>
                    <option value="bontrast">Bontrast</option>
                    <option value="flomtrast">Flomtrast</option>
                </select>       */}
    
                <p>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                              
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                <div className="container">
                    {this.data.items.map(function(c) {
                        var theFeedback = (c.Homophones[0]===this.data.sounds[this.state.selection]["spoken"] ? "Correct!" : "Wrong!");
                     
                        return <WordOption key={c.id} word={c.Homophones[0]} feedback={theFeedback} callbackParent={this.onWordChosen} mode={this.state.mode} />
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