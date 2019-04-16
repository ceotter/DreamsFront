import React, { Component, Fragment } from 'react';
import ChatBot from '../../chatbotHack';
import ColorBlob from '../ColorBlob';
import { ThemeProvider } from 'styled-components';
import blob from './blob.png'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/routes';

let nlp = require('compromise');

const theme = {
  background: 'rgba(255,255,255,0.0)',
  fontFamily: 'Helvetica Neue',
  headerBgColor: 'rgba(255,255,255,0.3)',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      steps: [
        {
          id: '1',
          message: `Tell me about your dream... I see that your dream contains several archetypes: ${this.propHandler(props)}`,
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          message: ({ previousValue, steps }) => {return this.elizaBot(previousValue)},
          trigger: '2',
        },
      ]
    }
  }

  propHandler = (props) => {
    console.log("props ", props.location.state);
    let passedArchs = props.location.state;
    let archString = "";
    for (let i = 0; i < passedArchs.length; i++) {
      if (i > 0 && i === passedArchs.length-1){
        archString += "and " + passedArchs[i] + "."
      } else {
        archString += passedArchs[i] + ", ";
      }
    }
    return archString;
  }

  elizaBot = (input) =>{
    const archetypesOpts = this.props.location.state.join('|');
    const archsWords = this.props.location.state.reduce((a, key) => Object.assign(a, { [key]: "Archetype" }), {});
    
    console.log("myObj ", archsWords);

    const plugin = {
      words:{
        ...archsWords,
        'facebook': 'Software',
        'google': 'Software',
        'salesforce': 'Software',
        "i can't" : 'iCant',
      },
      patterns:{
        "how (should|do)? i (can|should)? (log|login|sign|get) (in|into|to) my? #Software" : 'LoginIssue',
        "i can't (log|sign|get) into my? #Software" : 'LoginIssue',
        "#iCant (log|login|sign|get) (in|into) my? #Software" : 'LoginIssue',
        "#Software won't let me (log|sign|get) in" : 'LoginIssue',
        "what does the? #Archetype mean" : 'Question',
        "i can't * " : 'SelfDefeat',
      }
    }
    nlp.plugin(plugin)
    let doc = nlp(input)
    //templates
    if(doc.has('i #Adverb? (am|feel|feeling) #Adverb? #Adjective')){
        let feeling = doc.match('i #Adverb? am #Adverb? [#Adjective]').out('normal');
        return `When did you become ${feeling}?`;
    } 

    else if(doc.has('#Question')){
      let archQuest = doc.match(`(${archetypesOpts})`).out('normal')
      return `That is for you and you alone to decide. There are a lot of mysteries surrounding ${archQuest}`
    } 
    
    else if(doc.has(`(${archetypesOpts})`)){
        let whichArch = doc.match(`(${archetypesOpts})`).out('normal')
        return `Why don't you tell me more about the ${whichArch}.`
    } 
    
    else if(doc.has('#SelfDefeat')){
      let whichICant = doc.match('#SelfDefeat').out('normal')
      return `me neither, ${whichICant} either`
    } 
    
    else if(doc.has('#LoginIssue')){
        let whichSoftware = doc.match('#Software').out('normal')
        let whichArch = doc.match(`(${archetypesOpts})`).out('normal')
        return `that's okay, ${whichArch} don't even care about ${whichSoftware} anyway`
    } 

    
    else {
        return 'can you elaborate on that?'
    }
  }
  
  render() {
    console.log("voice from state ", this.state.voice)
    return(
      <Fragment>
        <BlobInputContainerSS>
          <ColorBlob/>
        </BlobInputContainerSS>
        <ChatbotContentS>
          <ChatBot
            botAvatar={`${blob}`}
            steps={this.state.steps} 
            headerTitle={"Shaman says"}
            recognitionEnable={true}
            speechSynthesis={{ enable: true, lang: 'en'}}
          />
          <br />
          <Link
            to={ROUTES.DREAM_ARCHIVE}
          >Go Back to Dream Archive</Link>
        </ChatbotContentS>
      </Fragment>
      
      
    )
  }
}

const ChatbotContentS = styled.div`
  position: relative;
`

const BlobInputContainerSS = styled.div`

  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250%;
  height: 50%;
  transform: scale(10);
  overflow: hidden;
`

export default Chat;