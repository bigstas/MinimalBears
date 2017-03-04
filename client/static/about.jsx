//'About' page

import React from 'react'
import YouTube from 'react-youtube'
import { Link } from 'react-router'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'
    
About = React.createClass({
    render() {
        const opts = {
            position: 'absolute',
            height: '400px',
            width: '100%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        }
        
        return (
            <div className='panel animated fadeIn' id='about'>
                <Translate content="about.title" component='h1' />
                <Translate content="about.whatIs" component='h2' />
                <p><Translate content="about.p1.line1" /><strong><Translate content="about.p1.HVPT" /></strong><Translate content="about.p1.line2" /></p>
                <p>It's <strong>simple</strong>, it's <strong>quick</strong>, and it's <strong>scientifically proven</strong> to be effective.</p>
                <p>You may have noticed that adult learners of a foreign language don't seem to improve their accent over time. This can be a barrier to communication, and often makes them seem less fluent than they really are.</p>
                <p>HVPT has been <a href="https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf">known for some time</a> by researchers to be an effective way of getting people to improve their ability to distinguish similar sounds in a foreign language, and <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3507383/">improve their accent as a result</a>. Minimal Bears is a <strong>free</strong>, <strong>open-source</strong> web app to allow language learners across the world to finally make use of this <a href="languagelog.ldc.upenn.edu/nll/?p=328">powerful yet little-known technique</a>.</p>
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
                <p>Prior to training, learners often perform <a href="http://www.haskins.yale.edu/Reprints/HL0194.pdf">barely better than chance</a> at distinguishing similar sounds in a foreign language. Significant improvements have been verified <a href="https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf">within 90 minutes of training</a>, and may appear within as little as 20 minutes.</p>
                <p>The effect has been verified for speakers and learners of many different languages, including <a href="http://asa.scitation.org/doi/abs/10.1121/1.4945716">Korean</a>, <a href="http://s3.amazonaws.com/academia.edu.documents/3247469/JAS003267.pdf?AWSAccessKeyId=AKIAIWOWYYGZ2Y53UL3A&Expires=1488648048&Signature=oMNb7WxbB7AiOCP%2BeJ9TqHgHDJU%3D&response-content-disposition=inline%3B%20filename%3DPhonetic_Training_With_Acoustic_Cue_Mani.pdf">Japanese</a>, <a href="assta.org/sst/SST-12/SST2012/PDF/AUTHOR/ST120021.PDF">Cantonese</a>, <a href="www.researchgate.net/profile/Ron_Thomson/publication/268926213_Computer_Assisted_Pronunciation_Training_Targeting_Second_Language_Vowel_Perception_Improves_Pronunciation/links/547bd8650cf205d16881c838/Computer-Assisted-Pronunciation-Training-Targeting-Second-Language-Vowel-Perception-Improves-Pronunciation.pdf">Mandarin</a>, <a href="www.researchgate.net/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-th_contrast_by_francophones">French</a>, <a href="asa.scitation.org/doi/abs/10.1121/1.2934625">Finnish</a>, and <a href="citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.424.6702&rep=rep1&type=pdf">Catalan-speaking learners of English</a>; <a href="asa.scitation.org/doi/abs/10.1121/1.4970670">Chinese learners of Korean</a>; and <a href="">English-speaking learners of Mandarin</a>.</p>
                <p>Researchers have found that people trained by this method have long-term improvements that only diminish very slightly over time. One team found that learners performed significantly better training, <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518835/">even when tested 6 months later</a> without any training in the interim.</p>
                <h2>How does it work?</h2>
                <p>There are three key features that make HVPT such an effective method: <em>lack of context</em>, <em>varied speakers</em>, and <em>immediate feedback</em>. All of them are present in Minimal Bears.</p>
                <h3>Lack of context</h3>
                <p>In order to learn the language in question, the speaker must have learned the sounds at least partially. However, in ambiguous cases, it is possible to get away with using the context as a guide.</p>
                <p>Take, for example, the phrase "You took the words right out of my mouth." Many learners of English would pronounce this "You took the words right out of my mouse", but be understood, because the listener knows that the idea of taking words from one's mouse is unlikely to be what the speaker is getting at. Similarly, the sentence "I'm sailing on a ship" would be understood correctly by a foreign speaker, even if they can't distinguish the word "ship" from the word "sheep" when out of context.</p>
                <p>As a result, after a certain point, simply engaging in conversation or listening to native speakers of the language does not help the learner to improve their ear or their accent.</p>
                <p>With HVPT, the learner is forced to make a decision as to whether the word said was "mouse" or "mouth", "sheep" or "ship" without any surrounding words to provide context. The learner can then only rely on their direct listening to the sounds, and this is what trains them to become better at distinguishing the sounds.</p>
                <h3>Varied speakers</h3>
                <p>It would seem reasonable that training using audio from more than one speaker should be better than just practising with one speaker's pronunciation. This common sense idea is also <a href="http://assta.org/sst/SST-12/SST2012/PDF/AUTHOR/ST120021.PDF">supported by research</a>.</p>
                <p>Research has shown that training using multiple different speakers, rather than just listening to one speaker, is a <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518834/">significantly more effective</a> way of training, leading to higher accuracy and faster response time, and allows for <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3509365/">easier generalisation of the gains made</a> to other speakers.</p>
                <h3>Immediate feedback</h3>
                <p>The importance of quick, unambiguous feedback for learning is one of behavioural science's most well-supported findings. However, in a social environment, small errors in pronouncing or distinguishing foreign sounds are rarely corrected in the moment. HVPT allows the learner to immediately perceive any errors, resulting in rapid progress.</p>
                <h2>Great! How do I get started?</h2>
                <p>Go to the <Link to="/train">Train page</Link>, choose your language and contrast to train, and get practising!</p>
                <h2>Is there a way I can contribute?</h2>
                <p>The audio for Minimal Bears is crowd-sourced, like Wikipedia. In order to expand the range of content (different contrasts from different languages, spoken by different people), we rely on words recorded by volunteers. If you'd like to contribute, go to the <Link to="/record">Record page</Link> and get talking!</p>
            {/* <br/>
                <hr/>
                <p><strong>Credits</strong> <br/>
                Concept: Guy Emerson <br/>
                Programming: Guy Emerson and Stanisław Pstrokoński <br/>
                Graphics: Gergő Halász</p> */}
            </div>
        )
    }
})

export default About