# Contributing to this project
Hello! Thank you for your interest in contributing to the Sword World 2.5e system for the Foundry VTT! 

## Code of Conduct
> Sourced from [this template](https://gist.github.com/PurpleBooth/b24679402957c63ec426)

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/

## Getting Started
One of the goals of this project is to make getting up and running as easy as possible for
hobbyist and professional developers. As such, there are few steps involved in getting things
up and running.

Before getting started, you'll need the following prerequisites:
- Your preferred `git` tooling
- Node.js (at least 18.x)
- Your preferred CLI tool
- Foundry (at least v11, preferably the Node bundle)

To get up and running, do the following:
- `cd` to the `Data/systems` directory in your Foundry install
- Clone this repo into the `Data/systems` folder
- `cd` into the cloned system folder
- Run the following commands: `npm i && npm start`

With that, the system is running in watch mode, ready for your changes!

## Major Concepts
This project makes use of some concepts that are less common in the Foundry sphere
that may be helpful to call out:
- Custom Elements, a means to encapsulate reusable UI element styling and functionality
- CSS Modules, a means to encapsulate CSS styling so as to avoid style collisions between
	parts of the project

When considering whether to use a Custom Element, class in a CSS Module, or a normal CSS class:
- If a UI element would, on its own, add a lot of complexity to a Document Sheet,
	make it a Custom Element, regardless of how many Document sheets can use it
- If a UI element is reusable beyond a single Document sheet and has unique
	functionality, make it a Custom Element
- If a UI element is reusable beyond a single Document sheet and lacks unique
  functionality, make it a global CSS class
- If a UI element is reusable within a single Document sheet, and lacks unique
	functionality, make it a module CSS class 

When in doubt: ask!

### Custom Element Considerations
Custom Elements aren't a standard part of Foundry development; as such, it may be helpful to give
a brief primer on how to create them, and what to watch out for.

#### Making a new Custom Element
New Custom Elements should be placed in a folder in the `src/components` folder. The
component should live in its own folder, with a Typescript file and an optional stylesheet.
The folder and contained files should have a kebab-cased name, with the `sw-` prefix. For example:

```
src/
  components/
		index.ts
	  ...
		sw-example-component/
			sw-example-component.ts
			sw-example-component.css
```

The new component should inherit from `src/components/base-component.ts`. The Base Component exposes
a number of helpful tools for your use, with some of the most commonly used being:

- `BaseComponent.styles`: A static getter that returns an array of `CSSStyleSheet` objects
- `template`: The HTML that the component renders
- `prepareData`: A place to prepare data (for example, fetching Documents from Foundry)
- `events`: A place to bind events to the component after it's rendered

#### Limitations to Custom Elements
Custom Elements are very powerful, especially in Foundry; however, with that power comes some
gotchas, such as:
- Foundry only fires its update code when traditional HTML input fields fire a change event.
	We have to add change event listeners to our Document sheets to get Foundry to pick up changes
	from a Custom Element
- A Custom Element can operate on multiple fields on a Document, but it requires some messy handling
  of the `name` property, which Foundry relies on to know which Document field to update when a
	sheet is modified. Avoid this when possible. Exceptions exist for things like the HP/MP meter.
- When a Custom Element causes a Document to update, Foundry won't delegate focus on the
	Document's sheet like it does with traditional HTML elements

