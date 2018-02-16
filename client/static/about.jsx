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
                <Translate content="about.whatIs.heading" component='h2' /> {/*What is Minimal Bears?*/}
                <div style={{display: "inline-block", float: "right", margin: "10px 1em 0 10px"}}>
                    <img src="bear.png" />
                    <p style={{display: "block", margin: "0px", textAlign: "center", fontSize: "13px", color: "#97989f"}}><em><Translate content="about.bearCaption" /></em></p>
                </div>
                
                <Translate component="p" content="about.whatIs.p1" />
                <Translate component="p" content="about.whatIs.p2" unsafe />
                {/* p3 is split into three parts, this is the only way that we can put the link into the text with translation */}
                <p><Translate content="about.whatIs.p3_start" unsafe />
                <Link to='/train'><Translate content="about.whatIs.p3_link" /></Link>
                <Translate content="about.whatIs.p3_end" /></p>
                
                <Translate component="h2" content="about.howWorks.heading" />
                <Translate component="p" content="about.howWorks.p1" unsafe />
                <Translate component="p" content="about.howWorks.p2" with={{url1: "http://www.minimalbears.com/articles/th_francophones.pdf", url2: "http://www.minimalbears.com/articles/proficiency_doesnt_matter.pdf", url3: "http://www.minimalbears.com/articles/rl_japanese_speech_production.pdf", url4: "http://languagelog.ldc.upenn.edu/nll/?p=328"}} unsafe />
                <Translate component="p" content="about.howWorks.p3" />
                
                <Translate component="h2" content="about.whyUse.heading" />
                <Translate component="p" content="about.whyUse.p1" />
                
                {/* TODO: this video does not fit dimensions neatly. Ideally, we want width to be 100%, and height to scale with width. */}
                {/* For details and options, see https://github.com/troybetz/react-youtube */}
                <YouTube
                    videoId="m1TnzCiUSI0"
                    opts={opts}
                    onReady={this._onReady}
                />
                
                <Translate component="h2" content="about.results.heading" />
                <Translate component="p" content="about.results.p1" unsafe />
                <Translate component="p" content="about.results.p2" with={{Korean: "http://asa.scitation.org/doi/abs/10.1121/1.4945716", Japanese: "http://www.minimalbears.com/articles/rl_japanese_acoustic_cue.pdf", Cantonese: "http://www.minimalbears.com/articles/ae_cantonese.PDF", Mandarin: "http://www.minimalbears.com/articles/10vowels_mandarin.pdf", French: "http://www.minimalbears.com/articles/th_francophones.pdf", Arabic: "http://www.minimalbears.com/articles/vowels_arabic.pdf", German: "http://www.minimalbears.com/articles/vowels_german&spanish.pdf", Portuguese: "http://www.minimalbears.com/articles/VOT_brazilian_portuguese.pdf", Finnish: "http://asa.scitation.org/doi/abs/10.1121/1.2934625", Greek: "http://minimalbears.com/articles/eei_greek.pdf", Catalan: "http://www.minimalbears.com/articles/stops&vowels_catalan.pdf", ChineseKorean: "http://asa.scitation.org/doi/abs/10.1121/1.4970670", EnglishArabic: "http://www.minimalbears.com/articles/english_learners_of_arabic.pdf", EnglishKorean: "http://www.minimalbears.com/articles/english_learners_of_korean.pdf", EnglishMandarin: "http://www.minimalbears.com/articles/english_learners_of_mandarin.pdf"}}  unsafe />
                <Translate component="p" content="about.results.p3" with={{sixMonths: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518835/"}} unsafe />
                <Translate component="p" content="about.results.p4" with={{confidence: "http://www.minimalbears.com/articles/english_learners_of_korean.pdf"}} unsafe />
                <div style={{paddingLeft: "15%", paddingRight: "15%"}}>
                    <p><em><Translate content="about.results.p5" /></em></p>
                </div>
                <Translate component="p" content="about.results.p6" with={{proficiency: "http://www.minimalbears.com/articles/proficiency_level_cantonese.pdf"}} unsafe />
                
                <Translate component="h2" content="about.whyWorks.heading" />
                <Translate component="p" content="about.whyWorks.p1" unsafe />
                <Translate component="h3" content="about.whyWorks.context.heading" />
                <Translate component="p" content="about.whyWorks.context.p1" unsafe />
                <Translate component="p" content="about.whyWorks.context.p2" />
                <Translate component="h3" content="about.whyWorks.varied.heading" />
                <Translate component="p" content="about.whyWorks.varied.p1" with={{supported: "http://www.minimalbears.com/articles/low&high_variability_cantonese.pdf"}} unsafe />
                {/*TODO put all links here <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3518834/"> <a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3509365/">*/}
                <Translate component="h3" content="about.whyWorks.feedback.heading" />
                <Translate component="p" content="about.whyWorks.feedback.p1" />
                
                <Translate component="h2" content="about.whichLangs.heading" />
                <p><Translate content="about.whichLangs.p1_start" /><Link to="/train"><Translate content="about.whichLangs.p1_link" /></Link><Translate content="about.whichLangs.p1_end" /></p>
                <Translate component="p" content="about.whichLangs.p2" />
                
                <Translate component="h2" content="about.getStarted.heading" />
                <p><Translate content="about.getStarted.p1_start" /><Link to="/train"><Translate content="about.getStarted.p1_link" /></Link><Translate content="about.getStarted.p1_end" /></p>
                
                <Translate component="h2" content="about.contribute.heading" />
                <p><Translate content="about.contribute.p1_start" /><Link to="/record"><Translate content="about.contribute.p1_link" /></Link><Translate content="about.contribute.p1_end" /></p>
            </div>
        )
    }
})

export default About


/*
For reference - article addresses
th_francophones: https://www.researchgate.net/profile/Donald_Jamieson/publication/226533069_Training_non-native_speech_contrasts_in_adults_Acquisition_of_the_English_d-TH_contrast_by_francophones/links/5670c10708ae0d8b0cc0fe3d.pdf
TODO this is part IV referenced in the Language Log article -- reference the others 
rl_japanese_speech_production: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3507383/
TODO this one's from 1975! Use for 'known for some time'
rl_japanese_slightly_better_than_chance :http://www.haskins.yale.edu/Reprints/HL0194.pdf
TODO the following actually refers to manipulation...
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
TODO find paper, not just powerpoint
english_learners_of_korean: http://www.aatk.org/www/html/2016Emory/program/data/Conference_Papers/Paper%2320.pdf
vowels_german&spanish: http://www.utdallas.edu/~assmann/hcs6367/iverson_evans09.pdf
proficiency_level_cantonese: http://repository.hkbu.edu.hk/cgi/viewcontent.cgi?article=7247&context=hkbu_staff_publication
proficiency_doesnt_matter: https://www.researchgate.net/profile/Janice_W_S_Wong/publication/260034394_Does_proficiency_matter_Effects_of_High_Variability_Phonetic_Training_on_the_Perception_and_Production_of_English_Vowels_by_Cantonese_ESL_learners_with_high_and_low_proficiency_levels/links/0f31752f2474cd7aff000000.pdf
immersion_arabic: https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2015/Papers/ICPHS0246.pdf -- this paper has a small sample size and doesn't properly account for confounding factors -- I also don't know how many potential users would worry about this

TODO add:
Yang et al. (2017)
https://www.researchgate.net/profile/Chunliang_Yang/publication/312645710_Metacognitive_Unawareness_of_the_Errorful_Generation_Benefit_and_Its_Effects_on_Self-Regulated_Learning/links/5894885292851c54574b9d7a/Metacognitive-Unawareness-of-the-Errorful-Generation-Benefit-and-Its-Effects-on-Self-Regulated-Learning.pdf
(not specifically for pronunciation) being corrected is more effective than passive learning, and people underestimate this 

*/