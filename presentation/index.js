// Import React
import React from "react";


// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Deck,
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
              Become a wizard in 30 minutes
            </Heading>
            @mweststrate - Michel Weststrate
          </Slide>

          <Slide>
            That escalated quickly..
            { /* wrong talk prepared */ }
          </Slide>

          <Slide>
            <Heading>Applications</Heading>
            1. Modify state
            2. Transform state in something useful
            <Code code={
`
var firstname = "michel"
var lastname = "weststrate"
`           } />
          </Slide>

          <Slide fill>
            <Heading>UI = view(state)</Heading>
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
            Rendering is a one time event. Values are just copied around.
<Code code={
`
function fullname () {
  return firstname + " " + lastname
}

React.render(
  <div>{fullname()}</div>,
  mountNode
)

firstname = "Veria" // <- ehhh..?
`           } />
            Connection with the 'source' is lost..
          </Slide>

          <Slide>
            <Heading>What we intuitively mean</Heading>
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
            Expressions instead of values
            Relations instead of data copies.
            Thunks FTW!
          </Slide>

          <Slide>
            Is it possible?
          </Slide>

          <Slide>            
            Can a Dutch guy turn a German team into champions?
          </Slide>

          <Slide>
            Robben.
            MobX fan.
          </Slide>


          <Slide>
            <Heading>The problem</Heading>
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
            1. When to re-evaluate fullname?
            2. When to re-render?
          </Slide>

          <Slide>
            Answer: observe all the things!
            And rerun whenever something relevant changes
          </Slide>

          <Slide>
            1. Make all state observable.
            2. Track which thunk uses what
          </Slide>

          <Slide>
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
          http://jsbin.com/teleferoje/1/edit?js,console,output
          </Slide>

          <Slide>
            <Heading>WTF just happened?</Heading>
            autorun observes fullname
            fullname observes firstname and lastname
          </Slide>

          <Slide>
            It's magic!
          </Slide>

          <CodeSlide
            transition={[]}
            lang="jsx"
            code={require("raw!../assets/pseudo.example")}
            ranges={toRanges([
              4, 24, 7, 14, 18, 22, 25,
              42, 27, 31, 38, 34, 35, 36, 37, 39, 42,
              49, 44, 47, 50, 53, 57, 61, 64
            ])}
          />

          <Slide>
            Computed and autorun run their thunks, track which observables they access, and start observing those observables.
            * Synchronously (no digest loop)
            * No off-stack debugging
            * Predictable
            * Glitchfree
          </Slide>

          <Slide>
            MobX:
            * dedupes and diffs depencies
            * makes sure computed values stop observing if nobody observes them
            Plaatje
          </Slide>


          <Slide>
            Dynamic dependencies
            <Code code={
`
const firstname = observable("michel")
const lastname = observable("weststrate")

const fullname = computed(() => {
  return firstname.get() + " " + lastname.get()
})

autorun(() => {
  React.render(
    <div>{firstname.get() === 42 ? "Universe!" : fullname.get()}</div>,
    mountNode
  )
}

firstname.set(42)
`           } />
          </Slide>

          <Slide>
            Q: When does MobX run stuff?
            A: Directly! Always! Synchronously!
          </Slide>

          <Slide>
            Q: Isn't that a bit too much?
            A: (trans)actions bundle changes
               ... But derivations are still consistent if used
          </Slide>

          <Slide>
            Q:When does MobX stop running stuff?
            A: If the computation is not in use anymore (computed)
            A: .. Unless it has a side effects (autorun)
          </Slide>

          <Slide>
            Conceptual overview
          </Slide>

          <Slide>
            All cool. It just doesn't look like MobX.
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
  }
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
            Q: Nice. Where is this good for?
            A: Focus on the essence manage your state.
            The rest can be derived from that. MobX makes sure that happens.
          </Slide>

          <CodeSlide
            transition={[]}
            lang="jsx"
            code={require("raw!../assets/todo.example")}
            ranges={toRanges([
              9,
              16,
              30,
              21,
              26,
              31,
              40,
              50
            ])}
          />

          <Slide>
            Ok, what does something real look like:
            http://jsbin.com/kupisuzode/1/edit?js,console,output
          </Slide>

          <Slide>
            You are a wizard now! Ready to enchant your PM!
            https://github.io/mobxjs/mobx
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
