import React from 'react'
import YouTube from 'react-youtube'
import { Link } from 'react-router'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'
    
const About = React.createClass({
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
                {/*<Translate content="about.title" component='h1' />*/}
                <Translate content="about.whatIs" component='h2' /> {/*What is Minimal Bears?*/}
                <div style={{display: "inline-block", float: "right", margin: "10px 1em 0 10px"}}>
                    <img src="bear.png" />
                    <p style={{display: "block", margin: "0px", textAlign: "center", fontSize: "13px", color: "#97989f"}}><em>Brown Bear has done their research</em></p>
                </div>
                {/*<p><Translate content="about.p1.line1" /><strong><Translate content="about.p1.HVPT" /></strong><Translate content="about.p1.line2" /></p>*/}
                <p>You may have noticed that adult learners of a language speak with a foreign accent, even after many years of learning and practice. This can be a barrier to communication, and often makes them seem less fluent than they really are.</p>
                <p>Minimal Bears is a web app that helps you learn the sounds of a foreign language. It's <strong>simple</strong>, it's <strong>quick</strong>, and it's <strong>scientifically proven</strong> to be effective.</p>
                <p>The app is <strong>free</strong> and <strong>open-source</strong>, and you can start using it <Link to="/train">right now</Link>.</p>
                 
                <h2>How does it work?</h2>
                <p>You learn by playing a simple game. You are presented with a pair of words that differ only in one sound &ndash; for example "mouse"/"mouth", "sheep"/"ship", or "will"/"well". Such a pair of words is called a <strong>minimal pair</strong>. You hear one of the words being said, and have to decide which one it was. You then get immediate feedback about the correct answer.</p>
                <p>Scientists have called this technique <strong>High Variability Phonetic Training</strong> (HVPT). This has been {/*TODO why this link? The Strange and Dittman paper is earlier*/} <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">known for some time</a> to be an effective way to improve people's ability to distinguish similar sounds in a foreign language, <a target="_blank" href="http://www.minimalbears.com/articles/proficiency_doesnt_matter.pdf">regardless of their level of proficiency</a>, and <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_speech_production.pdf">improve their accent as a result</a>. Despite the research, this technique is <a target="_blank" href="http://languagelog.ldc.upenn.edu/nll/?p=328">not well-known</a>, and we designed Minimal Bears to fill this gap.</p>
                <p>As you practise, you will find it easier and easier to recognise the sounds.</p>
                
                <h2>Why might I want to use it?</h2>
                <p>This video provides a humorous demonstration of the kinds of problems we are trying to solve.</p>
                {/* TO DO: this video does not fit dimensions neatly. Ideally, we want width to be 100%, and height to scale with width. */}
                {/* For details and options, see https://github.com/troybetz/react-youtube */}
                {/* TODO credits for video */}
                <YouTube
                    videoId="m1TnzCiUSI0"
                    opts={opts}
                    onReady={this._onReady}
                />
                
                <h2>What results can I expect?</h2>
                <p>Prior to training, learners often perform <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_slightly_better_than_chance.pdf">barely better than chance</a> at distinguishing similar sounds in a foreign language. {/*TODO even if they've lived in target language community for several years*/} Significant improvements have been verified <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">within 90 minutes of training</a>, and may appear within as little as 20 minutes.</p> {/*TODO reference for 20 minute claim*/}
                <p>The effect has been verified for speakers and learners of many different languages, including <a target="_blank" href="http://asa.scitation.org/doi/abs/10.1121/1.4945716">Korean-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_acoustic_cue.pdf">Japanese-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/ae_cantonese.PDF">Cantonese-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/10vowels_mandarin.pdf">Mandarin-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">French-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/vowels_arabic.pdf">Arabic-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/vowels_german&spanish.pdf">German-</a>, <a target="_blank" href="http://www.minimalbears.com/articles/VOT_brazilian_portuguese.pdf">Portuguese-</a>, <a target="_blank" href="http://asa.scitation.org/doi/abs/10.1121/1.2934625">Finnish-</a>, <a target="_blank" href="http://minimalbears.com/articles/eei_greek.pdf">Greek-</a>, and <a target="_blank" href="http://www.minimalbears.com/articles/stops&vowels_catalan.pdf">Catalan-speaking learners of English</a>; <a target="_blank" href="http://asa.scitation.org/doi/abs/10.1121/1.4970670">Chinese learners of Korean</a>; and <a target="_blank" href="http://www.minimalbears.com/articles/english_learners_of_arabic.pdf">English-speaking learners of Arabic</a>, <a target="_blank" href="http://www.minimalbears.com/articles/english_learners_of_korean.pdf">Korean</a>, and <a target="_blank" href="http://www.minimalbears.com/articles/english_learners_of_mandarin.pdf">Mandarin</a>.</p>
                <p>Researchers have found that people trained by this method have long-term improvements that only diminish very slightly over time. One team found that learners performed significantly better, <a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518835/">even when tested 6 months later</a>, without any training in the interim.</p>
                {/*TODO the quote is not in the link!*/}
                <p>In addition to improvements in the perception and production of sounds, learners also reported <a target="_blank" href="http://www.minimalbears.com/articles/english_learners_of_korean.pdf">increased confidence</a>, as in this quote from a learner: "I feel a lot more confidence compared to before training. I have more confidence saying it and listening to it. In general I have more confidence with the language."</p>
                <p>So regardless of your mother tongue, the language you are learning, or your <a target="_blank" href="http://www.minimalbears.com/articles/proficiency_level_cantonese.pdf">level of proficiency</a>, HVPT can help to improve your language skills.</p>
                
                <h2>Why does it work so well?</h2>
                <p>There are three key features that make HVPT such an effective method: <strong>lack of context</strong>, <strong>varied speakers</strong>, and <strong>immediate feedback</strong>. All of them are present in Minimal Bears.</p>
                {/*TODO h3 has a weird negative offset*/}
                
                <h3>Lack of context</h3>
                <p>For most minimal pairs, we can use the context as a guide. For example, suppose a learner struggles to distinguish "mouse" and "mouth". If they heard someone say "You took the words right out of my mouth", they're unlikely to start looking for a mouse!</p>
                {/*TODO add link*/}
                <p>As a result, simply engaging in conversation with native speakers of the language does not guarantee improvement. With Minimal Bears, you can't rely on the context, allowing you to focus on your listening skills.</p>
                
                <h3>Varied speakers</h3>
                <p>It would seem reasonable that training using audio from more than one speaker should be better than just practising with one speaker's pronunciation. This common sense idea is also <a target="_blank" href="http://www.minimalbears.com/articles/low&high_variability_cantonese.pdf">supported by research</a>.</p>
                {/*TODO separate links look like separate claims*/}
                <p>Research has shown that training using multiple different speakers, rather than just listening to one speaker, is a <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518834/">significantly more effective</a> way of training, leading to higher accuracy and faster response time, and allows for <a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3509365/">easier generalisation of the gains made</a> to other speakers.</p>
                
                <h3>Immediate feedback</h3>
                <p>The importance of quick, unambiguous feedback for learning is one of behavioural science's most well-supported findings. However, in a social environment, small errors in pronouncing or distinguishing foreign sounds are rarely corrected in the moment. HVPT allows the learner to immediately perceive any errors, resulting in rapid progress.</p>
                
                <h2>Which languages can I practise?</h2>
                <p>The range of languages whose minimal pairs you can practice on Minimal Bears is continually growing. Go to the <Link to="/train">Train page</Link> to see what languages are currently available.</p>
                <p>The site's interface is also becoming available in an increasing number of languages, so that more people can make use of it.</p>
                
                <h2>Great! How do I get started?</h2>
                <p>Go to the <Link to="/train">Train page</Link>, choose your language and contrast to train, and get practising!</p>
                
                <h2>Is there a way I can contribute?</h2>
                <p>The audio for Minimal Bears is crowd-sourced, like Wikipedia. In order to expand the range of content (different contrasts from different languages, spoken by different people), we rely on words recorded by volunteers. If you'd like to contribute, go to the <Link to="/record">Record page</Link> and get talking!</p>
            </div>
        )
    }
    /*
    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, () => {
            if (true)
                return 'The About page is very interesting. Are you sure you want to leave this page?'
        })
    }*/
})

export default About


/*
For reference - article addresses
th_francophones: https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf
rl_japanese_speech_production: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3507383/
rl_japanese_slightly_better_than_chance :http://www.haskins.yale.edu/Reprints/HL0194.pdf
rl_japanese_acoustic_cue: http://s3.amazonaws.com/academia.edu.documents/3247469/JAS003267.pdf?AWSAccessKeyId=AKIAIWOWYYGZ2Y53UL3A&Expires=1488648048&Signature=oMNb7WxbB7AiOCP%2BeJ9TqHgHDJU%3D&response-content-disposition=inline%3B%20filename%3DPhonetic_Training_With_Acoustic_Cue_Mani.pdf
ae_cantonese: http://assta.org/sst/SST-12/SST2012/PDF/AUTHOR/ST120021.PDF
10vowels_mandarin: http://www.researchgate.net/profile/Ron_Thomson/publication/268926213_Computer_Assisted_Pronunciation_Training_Targeting_Second_Language_Vowel_Perception_Improves_Pronunciation/links/547bd8650cf205d16881c838/Computer-Assisted-Pronunciation-Training-Targeting-Second-Language-Vowel-Perception-Improves-Pronunciation.pdf
vowels_arabic: http://s3.amazonaws.com/academia.edu.documents/33818104/ISSP_paper.pdf?AWSAccessKeyId=AKIAIWOWYYGZ2Y53UL3A&Expires=1491938619&Signature=mv1phS0G%2BD09OLFkqXp4BQEeVzM%3D&response-content-disposition=inline%3B%20filename%3DISSP_paper.pdf
VOT_brazilian_portuguese: http://s3.amazonaws.com/academia.edu.documents/38821550/ICPHS0656_ARato_ARauber_2015.pdf?AWSAccessKeyId=AKIAIWOWYYGZ2Y53UL3A&Expires=1491938802&Signature=I8j8NlPEu1wq%2BlS4WebP3QDOmAA%3D&response-content-disposition=inline%3B%20filename%3DThe_Effects_of_Perceptual_Training_on_th.pdf
eei_greek: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.426.5503&rep=rep1&type=pdf
stops&vowels_catalan: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.424.6702&rep=rep1&type=pdf
english_learners_of_arabic: https://repositories.lib.utexas.edu/bitstream/handle/2152/21607/BURNHAM-DISSERTATION-2013.pdf?sequence=1
english_learners_of_mandarin: https://kuscholarworks.ku.edu/bitstream/handle/1808/12998/Liu_ku_0099D_13137_DATA_1.pdf?sequence=1&isAllowed=y
low&high_variability_cantonese: http://assta.org/sst/SST-12/SST2012/PDF/AUTHOR/ST120021.PDF
english_learners_of_korean: http://www.aatk.org/www/html/2016Emory/program/data/Conference_Papers/Paper%2320.pdf
vowels_german&spanish: http://www.utdallas.edu/~assmann/hcs6367/iverson_evans09.pdf
proficiency_level_cantonese: http://repository.hkbu.edu.hk/cgi/viewcontent.cgi?article=7247&context=hkbu_staff_publication
proficiency_doesnt_matter: https://www.researchgate.net/profile/Janice_W_S_Wong/publication/260034394_Does_proficiency_matter_Effects_of_High_Variability_Phonetic_Training_on_the_Perception_and_Production_of_English_Vowels_by_Cantonese_ESL_learners_with_high_and_low_proficiency_levels/links/0f31752f2474cd7aff000000.pdf
immersion_arabic: https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2015/Papers/ICPHS0246.pdf -- this paper has a small sample size and doesn't properly account for confounding factors -- I also don't know how many potential users would worry about this

TODO add:
Yang et al. (2017)
https://www.researchgate.net/profile/Chunliang_Yang/publication/312645710_Metacognitive_Unawareness_of_the_Errorful_Generation_Benefit_and_Its_Effects_on_Self-Regulated_Learning/links/5894885292851c54574b9d7a/Metacognitive-Unawareness-of-the-Errorful-Generation-Benefit-and-Its-Effects-on-Self-Regulated-Learning.pdf
(not specifically for pronunciation) being corrected is more effective than passive learning 

*/