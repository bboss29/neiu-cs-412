# REFFER

## Objective
<small>*In 5-10 sentences, describe the objective of your web application. What is it? What will it do? As you write this, remember that all code written for the homework and the project must be your own work and cannot have been developed for a previous course or project.* </small>

The objective of REFFER is to provide a catalog of references within and between books, TV shows, movies, games and other media. The types of references include symbolism, foreshadowing, callbacks, allusions and direct references to other works. Pointing out these literary devices can help the reader/viewer/player better understand and appreciate the creator's work and intent. REFFER can be used casually by people who want to look up the significance of a plot point or a character's motivation, or it can be used academically to analyze a work or more objectively assess the writing quality of a work. Literary devices, when used masterfully by a creator and understood by the viewer, can be very gratifying for the creator and the viewer. 

#### Example: Game of Thrones (spoilers)

REFFER would draw a line from where "Winter is Coming" is mentioned throughout the show to the Night King invading Westeros in the final seasons.

#### Example: Pixar

Pixar films often have many references to other Pixar films hidden in them. REFFER can catalog and highlight these references.

## Motivation
<small>*In 5-10 sentences, describe why this project topic is of interest to you. Aside from the fact that this project is a required component for the course, why do you want to build this particular application?* </small>

I've always been interested in TV shows, books and movies, and I'm no stranger to having references and symbolism go right over my head. Sometimes a character would make a decision or a plot point would develop that makes no sense to me, but upon reviewing the story, there is usually evidence that the outcome was subtly hinted at before the event occurred. Even before the event occurs, it's fun to speculate with the given information and see what other people are thinking as well. I also appreciate when creators reward viewers for remembering key events or subtleties (foreshadowing / callbacks) and for being cognizant of the other works they are referencing (allusions).

Even after a show ends, there is often an active community of people who are newcomers to the show and veterans who analyze and dissect the show for these references. However, these references are usually discovered and discussed in a decentralized way (forums, discussions, image posts). I think people would benefit, myself included, from having a centralized catalog where these references could be compiled.

## Server-Side Components
<small>*What aspects of the application will be related to storing user information or data in a database?* </small>

The application runs on Node.js and requires a mongoDB database.

### Packages
- "bcrypt": "^5.0.0",
- "bootstrap": "^4.5.3",
- "connect-flash": "^0.1.1",
- "cookie-parser": "~1.4.4",
- "d3": "^6.2.0",
- "debug": "~2.6.9",
- "express": "~4.16.1",
- "express-handlebars": "^5.1.0",
- "express-session": "^1.17.1",
- "express-validator": "^6.7.0",
- "feather-icons": "^4.28.0",
- "hbs": "~4.0.4",
- "http-errors": "~1.6.3",
- "jquery": "^3.5.1",
- "memorystore": "^1.6.4",
- "mongoose": "^5.10.15",
- "morgan": "~1.9.1",
- "passport": "^0.4.1",
- "passport-local-mongoose": "^6.0.1",
- "popper.js": "^1.16.1"

The application requires the following data to be stored in the database:
- Users
    - represents a user account
    - stores identifying information (username)
- Works
    - represents a TV show / movie series / book series / ...
    - stores metadata (# of components, genre, ...)
- Links
    - represents a reference between two Works