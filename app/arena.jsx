// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)


// Define a collection to hold languages
Languages = new Mongo.Collection("languages");

// Progress bar
var ProgressBar = React.createClass({
    render() {
        return (
            <div id="progress">
                <div id="fill" style={this.props.style}></div>
            </div>
        );
    }
});

// Progress button
var Button = React.createClass({
    render() {
        var btnClass = 'enabledProgress animated rubberBand';
        var click = this.props.handle;
        if (this.props.disabled) {
            btnClass = 'disabledProgress';
            click = function () {}; // click doesn't do anything when it's disabled
        }
        return (
            <div id="button" className={btnClass} onClick={click}>Progress</div>
        );
    }
});

// Button for responding to a recording
var WordOption = React.createClass({ 
    handleClick() {
        if (this.props.mode === "ask") {
            this.props.callbackParent();
        }
    },
    
    render() {
        var background = (this.props.mode === "feedback")
            ? (this.props.feedback === "Correct!") ? "green" : "red"
            : "#b0b0e0" ;
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        var wordOptionClass = (this.props.mode === "ask" ? 'wordOption wordOptionActive animated pulse' : 'wordOption');
        
        return (
            <div className={wordOptionClass}
            onClick={this.handleClick}
            style={{backgroundColor: background}}>
                {text}
            </div>
        );
    }
});

// The arena - where the action happens
// currently in the process of ADAPTING this from Parse to Meteor
Arena = React.createClass({
    getInitialState() {
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
        };
    },
    
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],
    
    // Loads items from the Languages collection and puts them in this.data.languages
    getMeteorData() {
        return {
            languages: Languages.find({}, {sort: {createdAt: -1}}).fetch()
        }
    },
    
    // After the user chooses a language
    handleLanguageChange() {
        this.setState({
            activeLanguageId: document.getElementById("chooseLanguage").value,
            activeContrast: null,    // need to reset contrasts when language changes
        });
    },
    
    // After the user chooses a contrast
    handleContrastChange() {
        this.setState({
            activeContrast: JSON.parse(document.getElementById("chooseContrast").value),
            mode: 'feedback'
        });
    },
    
    // After the user chooses an option during training
    onWordChosen() {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        });
    },
    
    // After the user wants move on to the next recording
    handleProgressClick() {
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
    /* componentDidUpdate: function (props, state) {
        console.log(this.pendingQueries())
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    }, */
    
    render() {
        var buttonDisabled = (this.state.mode!=="feedback" || this.state.counter === this.state.maxRounds) ? true : false;
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar';
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound);
            snd.play()
        }
        
        return (
            <div id="arena">
                {/* Dropdown menus for language and contrast */}
                <select id="chooseLanguage" onChange={this.handleLanguageChange}>
                    {this.data.languages.map(function(c) {
                        return <option value={c.Name} key={c._id}>{c.Name}</option>
                    })}
        </select>
        {/*        <select id="chooseContrast" onChange={this.handleContrastChange}>
                    {this.data.contrasts.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={stringified} key={stringified}>{c.Name}</option>
                    })}                    
                </select>
                
                {/* Training area */}
                <p id='arenaMessage' style={{color: 'darkkhaki'}}>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                <img className={starClass} src={this.data.starImage} alt='star' />
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div id='optionContainer' className="container">
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
});