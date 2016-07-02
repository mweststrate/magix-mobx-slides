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
  magic: require("../assets/magic.gif"),
  harry: require("../assets/harry.gif"),
  harry2: require("../assets/harry2.gif"),
  robben: require("../assets/ruhrjs.jpg"),
  flow_notext: require("../assets/flow_notext.png"),
  observeall: require("../assets/observeall.jpg"),
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
        <Deck transition={["zoom", "slide"]} transitionDuration={500}>
          <Slide>
            <Image src={images.mobx.replace("/", "")} margin="0px auto 40px" height="293px"/>
            <Heading size={1} fit caps lineHeight={1}>
              Magic MobX
            </Heading>
            <Heading size={1} fit caps>
              Become a reactive wizard in 30 minutes
            </Heading>
            <Text textColor="white">
              @mweststrate - Michel Weststrate
            </Text>
          </Slide>

          <Slide>
            <Image src={images.escalated.replace("/", "")} margin="0px auto 40px" width="100%"/>
          </Slide>

          <Slide>
            <Image src={images.mobx.replace("/", "")} margin="0px auto 40px" height="293px"/>
            <Heading size={1} fit caps lineHeight={1}>
              Magic MobX
            </Heading>
            Tweet
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
              <ListItem>Modify state</ListItem>
              <ListItem>Transform state in something storable or viewable</ListItem>
            </List>
            <Fill>
                <Code code={
    `
var firstname = "michel"
var lastname  = "weststrate"
    `           } />
            </Fill>
          </Slide>

          <Slide fill>
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

          <Slide align="flex-start">
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

          <Slide align="flex-start" transitionDuration={0}>
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

firstname = "Veria" // <- ehhh..?
`           } />
            <List>
              <Appear><ListItem>Values are just copied around.</ListItem></Appear>
              <Appear><ListItem>Connection with the 'source' is lost..</ListItem></Appear>
            </List>
          </Slide>

          <Slide align="flex-start">
            <Heading>What we mean</Heading>
            <Code code={
`
function fullname () {
  return () => firstname + " " + () => lastname
}

React.render(
  <div>{() => fullname()},
  mountNode
)
`           } />
            <List>
              <Appear><ListItem>Relations instead of copied values</ListItem></Appear>
              <Appear><ListItem>Pass thunks instead of values</ListItem></Appear>
              <Appear><ListItem>Deferred evalutation</ListItem></Appear>
            </List>
          </Slide>

          <Slide>
            Is it possible?
          </Slide>

          <Slide>            
            Can a Dutch guy turn a German team into champions?
          </Slide>

          <Slide>
            <Image src={images.robben.replace("/", "")} margin="0px auto 40px"/>
          </Slide>


          <Slide align="flex-start">
            <Heading>Difficult!</Heading>
            <Code code={
`
function fullname () {
  return () => firstname + " " + () => lastname
}

React.render(
  <div>{() => fullname()},
  mountNode
)
`           } />
            <List>
              <Appear><ListItem>When to re-evaluate fullname?</ListItem></Appear>
              <Appear><ListItem>When to render?</ListItem></Appear>
              <Appear><ListItem>When to stop re-evaluating</ListItem></Appear>
            </List>
          </Slide>

          <Slide>
            <Heading>We Need To..</Heading>
            <List>
              <Appear><ListItem>1. Make state observable</ListItem></Appear>
              <Appear><ListItem>2. Track the dependencies of thunks</ListItem></Appear>
              <Appear><ListItem>3. Rerun thunks (only) when needed</ListItem></Appear>
            </List>
            <Appear>
              <Image src={images.observeall.replace("/", "")} margin="0px auto 40px"/>
            </Appear>
          </Slide>

          <Slide>
            <Heading>Applications</Heading>
            <List>
              <ListItem>Modify state</ListItem>
              <ListItem>Transform state in something storable or viewable</ListItem>
              <Appear><ListItem>MobX: keeps transformations consistens with modifycations
                <List>
<Appear><ListItem>At all times</ListItem></Appear>
<Appear><ListItem>With the minimum amount of recomputations possible</ListItem></Appear>
                </List>
              
              </ListItem></Appear>
            </List>
          </Slide>

          <Slide align="flex-start">
            <Heading>MobX</Heading>
            <List>
              <Appear><ListItem>observable: makes values observable</ListItem></Appear>
              <Appear><ListItem>computed
                <List>
                  <ListItem>Tracks a thunk, runs when needed</ListItem>
                  <ListItem>..But only when being observed</ListItem>
                  <ListItem>Produces values</ListItem>
                </List>
              </ListItem></Appear>
              <Appear><ListItem>autorun
                <List>
                  <ListItem>Tracks a thunk, runs when needed</ListItem>
                  <ListItem>Reruns when needed</ListItem>
                  <ListItem>Produces effects (aka. reactions)</ListItem>
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

          <Slide>
          <Link textColor="white" fit href="http://jsbin.com/teleferoje/1/edit?js,console,output">Demo</Link>
          </Slide>

          <Slide>
            <Heading>WTF just happened?</Heading>
            <Image src={images.magic.replace("/", "")} margin="0px auto 40px"/>
            <List>
              <ListItem>autorun thunk observes fullname</ListItem>
              <ListItem>fullname thunk observes firstname and lastname</ListItem>
              <ListItem>firstname changed</ListItem>
              <ListItem>fullname recomputed</ListItem>
              <ListItem>autorun ran again</ListItem>
            </List>
          </Slide>

          <CodeSlide align="flex-start center" fill
            transition={[]}
            lang="jsx"
            code={require("raw!../assets/pseudo.example")}
            ranges={toRanges([
              4, 27, 7, 16, 20, 25, 28,
              46, 30, 34, 38, 43, 36, 38, 39, 41, 42, 46,
              47, 54, 58, 66, 69
            ])}
          />

          <Slide>
            <Heading>Too magical?</Heading>
            <List>
              <Appear><ListItem>Everything runs synchronous</ListItem></Appear>
              <Appear><ListItem>Dependency tree is analyzed</ListItem></Appear>
              <Appear><ListItem>No, double runs, no unneeded runs, glitch free</ListItem></Appear>
              <Appear><ListItem>Dependency tree is dynamic</ListItem></Appear>
              <Appear><ListItem>Unobserved computations are suspended</ListItem></Appear>
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

firstname.set(42)
`           } />
          </Slide>

          <Slide>
            https://docs.google.com/presentation/d/1d54mSxF0VOAFlsUGM8eonZDs9gZecTOz1ErSbnydChQ/edit
          </Slide>

          <Slide>
            <Heading>Mind Blown</Heading>
            <Appear><Image src={images.harry.replace("/", "")} margin="0px auto 40px"/></Appear>
            Magic? Just a bunch of counters and two collections
          </Slide>

          <Slide>
            Conceptual overview
            <Image src={images.flow_notext.replace("/", "")} margin="0px auto 40px"/>
          </Slide>

          <Slide>
            All cool. It just doesn't look like MobX yet.
          </Slide>

          <Slide>
            <Code code={
`
const my = observable({
  firstname: "michel",
  lastname: "weststrate",
  fullname: function() {
    return this.firstname + " " + this.lastname
  }
})

React.render(
  observer(() => <div>{my.fullname}</div>),
  mountNode
)

my.firstname = "Veria"
`           } />
          </Slide>


          <Slide>
            observer
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

         <Slide>
            <Code code={
`
const my = observable({
  firstname: "michel",
  lastname: "weststrate",
  fullname: function() {
    return this.firstname + " " + this.lastname
  }
})

React.render(
  observer(() => <div>{my.fullname}</div>),
  mountNode
)

my.firstname = "Veria"
`           } />
          </Slide>


          <Slide>
            Object.defineProperty
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


          <Slide>
            Constructor functions
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

const my = new Person()

React.render(
  observer(() => <div>{my.fullname}</div>),
  mountNode
)

my.firstname = "Veria"
`           } />
          </Slide>

          <Slide>
            ESNext!
            <Code code={
`
class Person {
  @observable firstname = "michel";
  @observable lastname = "weststrate";
  @computed get fullname() {
      return this.firstname + " " + this.lastname
  }
}

const my = new Person()

React.render(
  observer(() => <div>{my.fullname}</div>),
  mountNode
)

my.firstname = "Veria"
`           } />
          </Slide>

          <Slide>
            Examples
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
            Ok, what does something real look like:
            http://jsbin.com/wisexeqexe/edit?js,console,output
          </Slide>

          <Slide>
            Mendix Demo
          </Slide>

          <Slide>
            <Image src={images.congrats.replace("/", "")} margin="0px auto 40px"/>
          
            You are a wizard now! Ready to enchant your PM!
            https://github.io/mobxjs/mobx
            Egghead MobX fundamentals course coming soon!
            Swag
            @mweststrate

          </Slide>

        </Deck>
      </Spectacle>
    )
  }
}

class Presentation_ extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck transition={["zoom", "slide"]} transitionDuration={500}>
          <Slide transition={["zoom"]}>
            <Heading size={1} fit caps lineHeight={1}>
              Spectacle
            </Heading>
            <Heading size={1} fit caps>
              A ReactJS Presentation Library
            </Heading>
            <Heading size={1} fit caps>
              Where You Can Write Your Decks In JSX
            </Heading>
            <Link href="https://github.com/FormidableLabs/spectacle">
              <Text bold caps textColor="tertiary">View on Github</Text>
            </Link>
            <Text textSize="1.5em" margin="20px 0px 0px" bold>Hit Your Right Arrow To Begin!</Text>
          </Slide>

          <Slide transition={["slide"]} bgColor="black" notes="You can even put notes on your slide. How awesome is that?">
            <Image src={images.kat.replace("/", "")} margin="0px auto 40px" height="293px"/>
            <Heading size={2} caps fit textColor="primary" textFont="primary">
              Wait what?
            </Heading>
          </Slide>

          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="<ul><li>talk about that</li><li>and that</li></ul>">
            <CodePane
              lang="jsx"
              source={require("raw!../assets/deck.example")}
              margin="20px auto"
            />
          </Slide>
          <Slide transition={["slide"]} bgImage={images.city.replace("/", "")} bgDarken={0.75}>
            <Appear fid="1">
              <Heading size={1} caps fit textColor="primary">
                Full Width
              </Heading>
            </Appear>
            <Appear fid="2">
              <Heading size={1} caps fit textColor="tertiary">
                Adjustable Darkness
              </Heading>
            </Appear>
            <Appear fid="3">
              <Heading size={1} caps fit textColor="primary">
                Background Imagery
              </Heading>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Flexible Layouts</Heading>
            <Layout>
              <Fill>
                <Heading size={4} caps textColor="secondary" bgColor="white" margin={10}>
                  Left
                </Heading>
              </Fill>
              <Fill>
                <Heading size={4} caps textColor="secondary" bgColor="white" margin={10}>
                  Right
                </Heading>
              </Fill>
            </Layout>
          </Slide>
          <Slide transition={["slide"]} bgColor="black">
            <BlockQuote>
              <Quote>Wonderfully formatted quotes</Quote>
              <Cite>Ken Wheeler</Cite>
            </BlockQuote>
          </Slide>
          <Slide transition={["spin", "zoom"]} bgColor="tertiary">
            <Heading caps fit size={1} textColor="primary">
              Inline Markdown
            </Heading>
            <Markdown>
              {`
![Markdown Logo](${images.markdown.replace("/", "")})

You can write inline images, [Markdown Links](http://commonmark.org), paragraph text and most other markdown syntax
* Lists too!
* With ~~strikethrough~~ and _italic_
* And lets not forget **bold**
              `}
            </Markdown>
          </Slide>
          <Slide transition={["slide", "spin"]} bgColor="primary">
            <Heading caps fit size={1} textColor="tertiary">
              Smooth
            </Heading>
            <Heading caps fit size={1} textColor="secondary">
              Combinable Transitions
            </Heading>
          </Slide>
          <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
            <List>
              <Appear><ListItem>Inline style based theme system</ListItem></Appear>
              <Appear><ListItem>Autofit text</ListItem></Appear>
              <Appear><ListItem>Flexbox layout system</ListItem></Appear>
              <Appear><ListItem>React-Router navigation</ListItem></Appear>
              <Appear><ListItem>PDF export</ListItem></Appear>
              <Appear><ListItem>And...</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["slide"]} bgColor="primary">
            <Heading size={1} caps fit textColor="tertiary">
              Your presentations are interactive
            </Heading>
            <Interactive/>
          </Slide>
          <Slide transition={["spin", "slide"]} bgColor="tertiary">
            <Heading size={1} caps fit lineHeight={1.5} textColor="primary">
              Made with love in Seattle by
            </Heading>
            <Link href="http://www.formidablelabs.com"><Image width="100%" src={images.logo}/></Link>
          </Slide>
        </Deck>
      </Spectacle>
    );
  }
}
