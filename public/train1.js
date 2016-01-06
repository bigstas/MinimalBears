// Allow access to the server
Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');

/*-- React classes --*/

// Navigation bar
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

// Progress bar
var ProgressBar = React.createClass({
    render: function () {
        return (
            <div id="progress">
                <div id="fill" style={this.props.style}></div>
            </div>
        );
    }
})

// Progress button
var Button = React.createClass({    
    render: function () {
        return (
            <input type="button" id="button" value="Progress" disabled={this.props.disabled} onClick={this.props.handle}></input>
        );
    }
})

// Button for responding to a recording
var WordOption = React.createClass({ 
    handleClick: function () {
        if (this.props.mode === "ask") {
            this.props.callbackParent();
        }
    },
    
    render: function () {
        var background = (this.props.mode === "feedback")
            ? (this.props.feedback === "Correct!") ? "green" : "red"
            : "#b0b0e0" ;
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        
        return (
            <div className='wordOption'
            onClick={this.handleClick}
            style={{backgroundColor: background}}>
                {text}
            </div>
        );
    }
})

// The arena - where the action happens
var Arena = React.createClass({
    getInitialState: function () {
        this.data = {contrasts: []}; // For an empty dropdown list before a language is chosen
        return {
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "wait",
            activeLanguageId: null,
            activeContrast: null,
            activePair: {items: []},
            items: [],
            isLoading: true
        };
    },
    
    // Enable cloud code subscriptions
    mixins: [ParseCCMixin],
    
    // Cloud code subscriptions
    loadData: function(props, state) {
        var subs = {
            languages: {
                name: "fetchLanguages",
                propDeps: [],
                stateDeps: [],
                defaultValue: []
            }
        }
        if (state.activeLanguageId) {
            subs.contrasts = {
                name: "fetchContrasts",
                params: {languageId: state.activeLanguageId},
                propDeps: [],
                stateDeps: ['activeLanguageId'],
                defaultValue: []
            }
        }
        if (state.activeContrast) {
            subs.pair = {
                name: "fetchPair",
                params: {contrastId: state.activeContrast.objectId},
                propDeps: [],
                stateDeps: ['activeContrast'],
                defaultValue: null
            }
        }
        return subs
    },
    
    // After the user chooses a language
    handleLanguageChange: function() {
        this.setState({
            activeLanguageId: document.getElementById("chooseLanguage").value,
            activeContrast: null,    // need to reset contrasts when language changes
            isLoading: true
        });
    },
    
    // After the user chooses a contrast
    handleContrastChange: function () {
        this.setState({
            activeContrast: JSON.parse(document.getElementById("chooseContrast").value)
        });
    },
    
    // After the user chooses an option during training
    onWordChosen: function () {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        });
    },
    
    // After the user wants move on to the next recording
    handleProgressClick: function () {
        // Set the state, play the file, and issue a new query
        var pair = JSON.parse(this.data.pair);
        console.log(pair);
        this.setState({
            mode: "ask",
            activePair: pair
        });
        var snd = new Audio(pair.url);
        snd.play();
        // (If the file is blocked, the response header will have connection: close)
        this.reloadData(['pair'])
    },
    
    // Force a re-render after a query is returned
    componentDidUpdate: function (props, state) {
        console.log(this.pendingQueries())
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    },
    
    
    render: function () {
        var buttonDisabled = (this.state.mode==="ask" || this.state.counter === this.state.maxRounds) ? true : false;
        
        return (
            <div id="arena">
                {/* Dropdown menus for language and contrast */}
                <select id="chooseLanguage" onChange={this.handleLanguageChange}>
                    {this.data.languages.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={c.objectId}>{c.Name}</option>
                    })}
                </select>
                <select id="chooseContrast" onChange={this.handleContrastChange}>
                    {this.data.contrasts.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={stringified}>{c.Name}</option>
                    })}                    
                </select>
                
                {/* Training area */}
                <p>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                              
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div className="container">
                    {this.state.activePair.items.map(function(c) {
                        return <WordOption
                                word={c.text}
                                feedback={c.correct ? "Correct!" : "Wrong!"}
                                callbackParent={this.onWordChosen}
                                mode={this.state.mode} />
                    }, this)}
                </div>
            </div>
        );
    }
})

// Combine navigation bar and arena
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

// Render!
ReactDOM.render(
    <FullContent />,
    document.getElementById('content')
);