// Allow access to the server
Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');
// Import Cloud Code mixin
//var ParseCCMixin = require(['react-cloud-code-mixin'])
//import ParseCCMixin from 'react-cloud-code-mixin'
//var ParseCCMixin = require('react-cloud-code-mixin');

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

// The arena - where the action happens
var Arena = React.createClass({
    getInitialState: function () {
        return {
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "wait",
            activeLanguageId: null,
            activeContrast: null,
            items: [],
            isLoading: true
        };
    },
    
    // Enable query subscriptions and cloud code subscriptions
    mixins: [ParseCCMixin], //ParseReact.Mixin
    
    /*// Queries
    observe: function() {
        var subs = {
            languages: (new Parse.Query('Language')).ascending('Name')
        };
        
        if (this.state.activeLanguageId) {
            subs.contrasts = (new Parse.Query('Contrast')).equalTo('Language', new Parse.Object('Language', {id: this.state.activeLanguageId}));
        }
        
        return subs;
    },*/
    
    // Cloud code
    loadData: function() {
        return {
            languages: {
                name: "fetchLanguages"
                //propDeps: [],
                //stateDeps: [],
                //defaultValue: []
            }/*,
            contrasts: {
                name: "fetchContrasts",
                params: {pointer: new Parse.Object('Language', {id: this.state.activeLanguageId})}
            },
            pair: {
                name: "fetchPair",
                params: {pointer: new Parse.Object('Contrast', {id: this.state.activeContrast.objectId})}
            }*/
        }
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
        /* Annoyingly, this doesn't work, presumably because "fetch" only works in cloud code...
        or use Parse.Object?
        
        // Choose a pair, fetch the items
        var pairIndex = Math.floor(Math.random() * this.state.activeContrast.Pairs.length);
        console.log(this.state.activeContrast.Pairs[pairIndex]);
        var pair = this.state.activeContrast.Pairs[pairIndex].fetch();
        var firstItem = pair.First.fetch();
        var secondItem = pair.Second.fetch();
        var items = [firstItem, secondItem];
        
        // Choose the correct item, choose a file and fetch it
        var correct = Math.floor(Math.random() * 2);
        var audioIndex = Math.floor(Math.random() * items[correct].Audio.length);
        var audio = items[correct].Audio[audioIndex].fetch();
        */
        
        // Set the state and play the file
        this.setState({
            mode: "ask"
        });
        var snd = new Audio(this.data.pair.url);
        snd.play();
    },
    
    // Forces a re-render after a query is returned
    componentDidUpdate: function (props, state) {
        console.log(this.pendingQueries())
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    },
    
    render: function () {
        console.log(this.pendingQueries());
        console.log(this.data);
        
        var buttonDisabled = (this.state.mode==="ask" || this.state.counter === this.state.maxRounds) ? true : false;
        // If the language query hasn't returned, set languageOptions to be an empty array
        var languageOptions = null;
        try {
            languageOptions = this.data.languages.map(function(c) {
                return <option value={c.objectId}>{c.Name}</option>
            })
        } catch(e) {
            languageOptions = []
        }
        
        // If the contrast query hasn't returned, set contrastOptions to be an empty array
        var contrastOptions = null;
        try {
            contrastOptions = this.data.contrasts.map(function(c) {
                return <option value={JSON.stringify(c)}>{c.Name}</option>
            })
        } catch(e) {
            contrastOptions = []
        }
        
        // If we're not ready for training, set wordOptions to be an empty array
        var wordOptions = null
        try {
            wordOptions = this.data.pair.items.map(function(c) {
                return <WordOption
                        key={c.id}
                        word={c.text}
                        feedback={c.correct}
                        callbackParent={this.onWordChosen}
                        mode={this.state.mode} />
            })
        } catch(e) {
            wordOptions = []
        }
        
        return (
            <div id="arena">
                {/* Dropdown menus for language and contrast */}
                <select id="chooseLanguage" onChange={this.handleLanguageChange}>
                    {languageOptions}
                </select>
                <select id="chooseContrast" onChange={this.handleContrastChange}>
                    {contrastOptions}                    
                </select>
                
                {/* Training area */}
                <p>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                              
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div className="container">
                    {wordOptions}
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