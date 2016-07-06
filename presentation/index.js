// Import React
import React from "react";


// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Deck,
  Fit,
  Fill,
  Heading,
  Image,
  Layout,
  Link,
  ListItem,
  List,
  Markdown,
  Quote,
  Slide,
  Spectacle,
  Text
} from "spectacle";

import Playground from "component-playground";
import CodeSlide from 'spectacle-code-slide';

import {
  observable,
  extendObservable,
  autorun
} from "mobx";

import {
  observer
} from "mobx-react";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Import custom component
import Interactive from "../assets/interactive";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  mobx: require("../assets/mobx.png"),
  observables: require("../assets/observables.png"),
  congrats: require("../assets/congrats.gif"),
  escalated: require("../assets/escalated.gif"),
  fly: require("../assets/fly.gif"),
  magic: require("../assets/tada.gif"),
  magic2: require("../assets/magic2.png"),
  magic3: require("../assets/magic.png"),
  nos: require("../assets/NOS.png"),
  harry: require("../assets/harry.gif"),
  harry2: require("../assets/harry2.gif"),
  robben: require("../assets/ruhrjs.jpg"),
  flow_notext: require("../assets/flow_notext.png"),
  observeall: require("../assets/observeall.jpg"),
  thunks: require("../assets/thunks.jpg"),
  glitch: require("../assets/glitch.png"),
  
};

preloader(images);

const theme = createTheme({
  primary: "#fff",
  secondary: "#fff",
  tertiary: "#fff",
  quartenary: "#fff"
});

console.dir(theme)
theme.screen.global.body.background = "black";
theme.screen.global.body.color = "white";
theme.screen.components.heading.h1.fontSize = "5rem";
theme.screen.components.text.color = "white";
theme.screen.components.link.color = "white";

function trim(text) {
  return text.replace(/^\s*/, "").replace(/\s*$/, "");
}

class Code extends React.Component {
  render() {
    return (
      this.props.live === true
      ? (<div style={{textAlign: 'left'}}>
        <Playground codeText={trim(this.props.code)} scope={{ React, observable, extendObservable, autorun, observer }} es6Preview={true} noRender={false}/>
      </div>)
      : (<CodePane
          textSize="1em"
          lang="jsx"
          source={trim(this.props.code)}
          margin="20px auto"
        />)
    )
  }
}

function toRanges(nrs) {
  const res = nrs.map((l, i) => {
    if (i > 1 && l < nrs[i -1]) {
      return { loc: [nrs[i -2], l ]}
    } else {
      return { loc: [nrs[i -1] || 0, l ]};
    }
  });
  return res;
}

export default class Presentation extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck transition={["fade"]} transitionDuration={500}>
          <Slide>
            <Image src={images.mobx.replace("/", "")} margin="0px auto 40px" height="200"/>
            <Heading size={1} fit caps lineHeight={1}>
              Magic MobX
            </Heading>
            <Heading size={1} fit caps>
              Become a reactive wizard in 30 minutes
            </Heading>
            <Text textColor="white">
              @mweststrate - Michel Weststrate - Mendix
            </Text>
          </Slide>

          <Slide>
            <Image src={images.escalated.replace("/", "")} margin="0px auto 40px" width="100%"/>
          </Slide>

          <CodeSlide
            transition={[]}
            lang="jsx"
            code={require("raw!../assets/todo.example")}
            ranges={toRanges([
              13,
              23,
              36,
              26,
              32,
              37,
              47,
              49,
              54,
              60
            ])}
          />

          <Slide>
            <Link href="http://jsbin.com/wisexeqexe/edit?js,console,output">Demo</Link>
          </Slide>

          <Slide>
            Mendix Demo
          </Slide>

          <Slide>
            <Appear><Image src={images.magic3.replace("/", "")} margin="0px auto 40px" width="100%"/></Appear>
          </Slide>

          <Slide>
            <Image src={images.mobx.replace("/", "")} margin="0px auto 40px" height="200"/>
            <Heading size={1} fit caps lineHeight={1}>
              Magic MobX
            </Heading>
            <Heading size={1} fit caps>
              What problem does Transparent Reactive Programming solve?
            </Heading>
            <Heading size={1} fit caps>
              How does MobX know what to do?
            </Heading>
            <Heading size={1} fit caps>
              Why is MobX code so simple and fast?
            </Heading>
          </Slide>


          <Slide>
            <Heading>Applications</Heading>
            <List>
              <ListItem>Manage state</ListItem>
              <ListItem>Transform state into something storable or viewable</ListItem>
            </List>
            <Fill>
                <Code code={
    `
var firstname = "michel"
var lastname  = "weststrate"
    `           } />
            </Fill>
          </Slide>

          <Slide>
            <Heading>UI = view(state) ?</Heading>
            <Code code={
`
var firstname = "michel"
var lastname = "weststrate"

function fullname () {
  return firstname + " " + lastname
}

React.render(
  <div>{fullname()}</div>,
  mountNode
)
`           } />
          </Slide>

          <Slide>
            <Heading>The Problem</Heading>
            
<Code code={
`
function fullname () {
  return "michel" + " " + "weststrate"
}

React.render(
  <div>{"michel weststrate"}</div>,
  mountNode
)
`           } />
          </Slide>

          <Slide>
            <Heading>The Problem</Heading>
            
<Code code={
`
React.render(
  <div>{"michel weststrate"}</div>,
  mountNode
)

firstname = "Veria" // <- ehhh..?
`           } />
            <List>
              <Appear><ListItem>Values are just copied around.</ListItem></Appear>
              <Appear><ListItem>Connection with the source state is lost..</ListItem></Appear>
            </List>
          </Slide>

          <Slide align="flex-start">
            <Heading>What We Mean</Heading>
            <Code code={
`
function fullname () {
  return () => firstname + " " + () => lastname
}

React.render(
  <div>{() => fullname()}</div>,
  mountNode
)
`           } />
            <List>
              <Appear><ListItem>Relations instead of copied values</ListItem></Appear>
              <Appear><ListItem>Pass thunks instead of values</ListItem></Appear>
            </List>
          </Slide>

          <Slide>
            <Image src={images.thunks.replace("/", "")} margin="0px auto 40px" height="80vh"/>
          </Slide>

          <Slide align="flex-start">
            <Heading>Difficult!</Heading>
            <Code code={
`
function fullname () {
  return () => firstname + " " + () => lastname
}

React.render(
  <div>{() => fullname()}</div>,
  mountNode
)
`           } />
            <List>
              <Appear><ListItem>When to re-evaluate fullname?</ListItem></Appear>
              <Appear><ListItem>When to render?</ListItem></Appear>
              <Appear><ListItem>When to stop re-evaluating?</ListItem></Appear>
            </List>
          </Slide>

          <Slide>
            <Heading>We Need To..</Heading>
            <List>
              <Appear><ListItem>1. Make state observable</ListItem></Appear>
              <Appear><ListItem>2. Track the dependencies of thunks</ListItem></Appear>
              <Appear><ListItem>3. Re-run thunks (only) when needed</ListItem></Appear>
            </List>
            <Appear>
              <Image src={images.observeall.replace("/", "")} margin="0px auto 40px"/>
            </Appear>
          </Slide>

          <Slide>
            <Heading>Applications</Heading>
            <List>
              <ListItem>Manage state</ListItem>
              <ListItem>Transform state into something storable or viewable</ListItem>
              <Appear><ListItem>MobX: keeps transformations consistent with modifications
                <List>
                  <Appear><ListItem padding="0 0 0 10%">At all times</ListItem></Appear>
                  <Appear><ListItem padding="0 0 0 10%">With the minimum amount of recomputations</ListItem></Appear>
                </List>
              
              </ListItem></Appear>
            </List>
          </Slide>

          <Slide align="flex-start">
            <Code code={
`
const firstname = observable("michel")
const lastname = observable("weststrate")

const fullname = computed(() => {
  return firstname.get() + " " + lastname.get()
})

autorun(() => {
  React.render(
    <div>{fullname.get()}</div>,
    mountNode
  )
}

firstname.set("Veria")
`           } />
          </Slide>

          <Slide align="center flex-start">
            <Appear>
              <Text caps textColor="white" textAlign="left" textSize="2em" >Observable</Text>
            </Appear>
            <Appear>
              <List>
                <ListItem>Makes values, objects, arrays, refs etc observable</ListItem>
              </List>
            </Appear>
            <Appear>
              <Text caps textColor="white" textAlign="left" textSize="2em" >Autorun</Text>
            </Appear>
            <Appear>
              <List>
                <ListItem>Takes a thunk, runs it when needed</ListItem>
                <ListItem>Produces effects (aka. reactions)</ListItem>
              </List>
            </Appear>
            <Appear>
              <Text caps textColor="white" textAlign="left" textSize="2em" >Computed</Text>
            </Appear>
            <Appear>
              <List>
                <ListItem>Takes a thunk, runs it when needed</ListItem>
                <ListItem>But only when being observed</ListItem>
                <ListItem>Produces values</ListItem>
              </List>
            </Appear>
          </Slide>

          <Slide align="flex-start">
            <Code code={
`
const firstname = observable("michel")
const lastname = observable("weststrate")

const fullname = computed(() => {
  return firstname.get() + " " + lastname.get()
})

autorun(() => {
  React.render(
    <div>{fullname.get()}</div>,
    mountNode
  )
}

firstname.set("Veria")
`           } />
          </Slide>


          <Slide>
          <Link textColor="white" fit href="http://jsbin.com/teleferoje/1/edit?js,console,output">Demo</Link>
          </Slide>

          <Slide>
            <Image src={images.magic.replace("/", "")} margin="0px auto 40px" width="30vh"/>
            <List>
              <Appear><ListItem>autorun thunk observes fullname</ListItem></Appear>
              <Appear><ListItem>fullname thunk observes firstname and lastname</ListItem></Appear>
              <Appear><ListItem>firstname changed</ListItem></Appear>
              <Appear><ListItem>fullname recomputed</ListItem></Appear>
              <Appear><ListItem>autorun run again</ListItem></Appear>
            </List>
          </Slide>

          <CodeSlide align="flex-start center" fill
            transition={[]}
            lang="jsx"
            code={require("raw!../assets/pseudo.example")}
            ranges={toRanges([
              4, 7, 16, 20, 25, 28,
              30, 34, 43, 36, 38, 39, 41, 42, 46,
              47, 54, 58, 66, 69
            ])}
          />

          <Slide>
            <Heading>TRP in MobX</Heading>
            <List>
              <Appear><ListItem>Everything runs synchronous</ListItem></Appear>
              <Appear><ListItem>Dependency tree is dynamic</ListItem></Appear>
              <Appear><ListItem>No, double runs, no unneeded runs, glitch free</ListItem></Appear>
              <Appear><ListItem>Unobserved computations are suspended</ListItem></Appear>
              <Appear><ListItem>Generic solution. Not just UI.</ListItem></Appear>
            </List>
          </Slide>

          <Slide>
            <Code code={
`
autorun(() => {
  React.render(
    <div>{
      firstname.get() === 42 
        ? "Universe!" 
        : fullname.get()
    }</div>,
    mountNode
  )
}
`           } />
          </Slide>

          <Slide>
            <Link href="https://docs.google.com/presentation/d/1d54mSxF0VOAFlsUGM8eonZDs9gZecTOz1ErSbnydChQ/">More slides!</Link>
          </Slide>

          <Slide>
            <Appear><Image src={images.harry.replace("/", "")} width="100%" margin="0px auto 40px"/></Appear>
            <Appear>
              <Text>MobX Magic?</Text>
            </Appear>
            <Appear>
              <Text>Just a stack of thunks, a bunch of counters and two collections</Text>
            </Appear>
          </Slide>

          <Slide>
            <Heading caps fit>
              But it doesn't look like MobX...
            </Heading>
          </Slide>

          <Slide align="flex-start">
            <Code code={
`
const state = observable({
  firstname: "michel",
  lastname: "weststrate",
  fullname: function() {
    return this.firstname + " " + this.lastname
  }
})

React.render(
  observer(() => <div>{state.fullname}</div>),
  mountNode
)

state.firstname = "Veria"
`           } />
          </Slide>


          <Slide  align="flex-start">
            <Heading>Observer</Heading>
            <Code code={
`
class MyComponent extends Component {
  componentDidMount() {
    this.disposer = autorun(() => {
      this.render()
    }
  },
  componentWillUnmount() {
    this.disposer();
  },
  render() {
    /// stuff
  }
}
`           } />
          </Slide>

         <Slide  align="flex-start">
            <Code code={
`
const state = observable({
  firstname: "michel",
  lastname: "weststrate",
  fullname: function() {
    return this.firstname + " " + this.lastname
  }
})

React.render(
  observer(() => <div>{state.fullname}</div>),
  mountNode
)

state.firstname = "Veria"
`           } />
          </Slide>


          <Slide  align="flex-start">
            <Heading>Object Properties</Heading>
            <Code code={
`
function observable(object) {
  return extendObservable(object, object)
}

function extendObservable(target, source) {
  source.keys.forEach(key => {
    const value = observable(source[key])
    Object.defineProperty(target, key, {
      set: value.set,
      get: value.get
    })
  })
}
`           } />
          </Slide>


          <Slide  align="flex-start">
            <Heading>Constructors</Heading>
            <Code code={
`
function Person() {
  extendObservable(this, {
    firstname: "michel",
    lastname: "weststrate",
    fullname: function() {
      return this.firstname + " " + this.lastname
    }
  })
)

const state = new Person()
`           } />
          </Slide>

          <Slide>
            <Heading>ESNext classes</Heading>
            <Code code={
`
class Person {
  @observable firstname = "michel";
  @observable lastname = "weststrate";
  @computed get fullname() {
      return this.firstname + " " + this.lastname
  }
}

const state = new Person()
`           } />
          </Slide>

          <Slide>
            <Appear><Heading caps fit>
              Change Detection?
            </Heading></Appear>
            <Appear><Text textColor="white">No need for that. Observables simply notify observers</Text></Appear>
            <Appear><Heading caps fit>
              Making changes async?
            </Heading></Appear>
            <Appear><Text textColor="white">Works out of the box. 'cause: no change detection.</Text></Appear>
            <Appear><Image src={images.fly.replace("/", "")} margin="0px auto 40px" width="100%"/></Appear>
        
          </Slide>

          <Slide>
            <Appear><Heading caps fit>
              Immutables?
            </Heading></Appear>
            <Appear><Text textColor="white">Perf wise: Mutable &lt; Immutable &lt; Observables</Text></Appear>
            <Appear><Text textColor="white">MobX implements shouldComponentUpdate using pointer equality (PureRenderMixin)</Text></Appear>
            <Appear><Image src={images.harry2.replace("/", "")} margin="0px auto 40px"/></Appear>
          </Slide>


          <Slide>
            <Image src={images.congrats.replace("/", "")} margin="0px auto 40px" width="100%"/>
            <Text fit>You are a wizard now! Enchant your PM</Text>
            <Appear><Link href="https://github.io/mobxjs/mobx" fit>https://github.io/mobxjs/mobx</Link></Appear>
            <Appear><Text>Egghead MobX fundamentals course coming soon</Text></Appear>
            <Appear><Text>@mweststrate</Text></Appear>
          </Slide>

        </Deck>
      </Spectacle>
    )
  }
}

