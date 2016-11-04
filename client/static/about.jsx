//'About' page

import React from 'react';
import YouTube from 'react-youtube';

About = React.createClass({
    render() {
        const opts = {
            height: '100%',
            width: '100%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };
        
        return (
            <div id='about'>
                <h1>Minimal Bears: the research-based web app that improves your accent.</h1>
                <h2>What is Minimal Bears?</h2>
                <p>Minimal Bears is a web app that uses a technique known as <strong>High Variability Phonetic Training</strong> (HVPT) to help people learn the sounds of a foreign language.</p>
                <p>It's <strong>simple</strong>, it's <strong>quick</strong>, and it's <strong>scientifically proven</strong> to be effective.</p>
                <p>You may have noticed that adult learners of a foreign language don't seem to improve their accent over time. This can be a barrier to communication, and often makes them seem less fluent than they really are.</p>
                <p>HVPT has been <a href="https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf">known for some time</a> by researchers to be an effective way of getting people to improve their ability to distinguish similar sounds in a foreign language, and <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3507383/">improve their accent as a result</a>. Minimal Bears is a <strong>free</strong>, <strong>open-source</strong> web app to allow language learners across the world to finally make use of this powerful yet little-known technique.</p>
                <h2>Why might I want to use it?</h2>
                <p>This video provides a humorous demonstration of the kinds of problems we are trying to solve.</p>
            
                {/* TO DO: this video does not fit dimensions neatly. Ideally, we want width to be 100%, and height to scale with width. */}
                {/* For details and options, see https://github.com/troybetz/react-youtube */}
                <YouTube
                    videoId="m1TnzCiUSI0"
                    opts={opts}
                    onReady={this._onReady}
                />
            
                <h2>What results can I expect?</h2>
                <p>Prior to training, learners often perform <a href="http://www.haskins.yale.edu/Reprints/HL0194.pdf">barely better than chance</a> at distinguishing similar sounds in a foreign language. Significant improvements have been verified <a href="https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf">within 90 minutes of training</a>, and may appear within as little as 20 minutes [citation??].</p>
                <p>Researchers have found that people trained by this method have long-term improvements that only diminish very slightly over time. One team found that learners improved significantly during training, and then had <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518835/">only dropped 2% in performance when re-tested 3 months later</a>, and only 4.5% after 6 months.</p>
                <h2>How does it work?</h2>
                <p>There are three key features that make HVPT such an effective method: <em>lack of context</em>, <em>varied speakers</em>, and <em>immediate feedback</em>. All of them are present in Minimal Bears.</p>
                <h3>Lack of context</h3>
                <p>In order to learn the language in question, the speaker must have learned the sounds at least partially. However, in ambiguous cases, it is possible to get away with using the context as a guide.</p>
                <p>Take, for example, the phrase "I put the grape in my mouth." Many learners of English would pronounce this "I put the grape in my mouse", but be understood, because the listener knows that the idea of putting a grape in one's mouse is unlikely to be what the speaker is getting at. Similarly, the sentence "I'm sailing on a ship" would be understood correctly by a foreign speaker, even if they can't distinguish the word "ship" from the word "sheep" when out of context.</p>
                <p>As a result, after a certain point, simply engaging in conversation or listening to native speakers of the language does not help the learner to improve their ear or their accent.</p>
                <p>With HVPT, the learner is forced to make a decision as to whether the word said was "mouse" or "mouth", "sheep" or "ship" without any surrounding words to provide context. The learner can then only rely on their direct listening to the sounds, and this is what trains them to become better at distinguishing the sounds.</p>
                <h3>Varied speakers</h3>
                <p>It would seem reasonable that training using audio from more than one speaker should be better than just practising with one speaker's pronunciation. This common-sensical idea is also supported by research.</p>
                <p>Research has shown that training using multiple different speakers, rather than just listening to one speaker, is a <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518834/">significantly more effective</a> way of training, leading to higher accuracy and faster response time, and allows for <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3509365/">easier generalisation of the gains made</a> to other speakers.</p>
                <h3>Immediate feedback</h3>
                <p>The importance of quick, unambiguous feedback for learning is one of behavioural science's most well-supported findings. However, in a social environment, small errors in pronouncing or distinguishing foreign sounds are rarely corrected in the moment. HVPT allows the learner to immediately perceive any errors, resulting in rapid progress.</p>
                <h2>Is there a way I can contribute?</h2>
                <p>The audio for Minimal Bears is crowd-sourced, like Wikipedia. In order to expand the range of content (different contrasts from different languages, spoken by different people), we rely on words recorded by volunteers. If you'd like to contribute, go to the Record page and get talking!</p>
                <br/>
                <hr/>
                <p><strong>Credits</strong> <br/>
                Concept: Guy Emerson <br/>
                Programming: Guy Emerson and Stanisław Pstrokoński <br/>
                Graphics: Gergő Halász [hopefully!]</p>
            </div>
        );
    }
});

export default About;