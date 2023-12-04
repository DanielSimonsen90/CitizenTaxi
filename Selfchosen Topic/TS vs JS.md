What is ts?
* Linter over js -- Superset of JS
  * JS == TS
  * TS != JS
* Compile ts to js
*  tsconfig.json
  - target
* Runtime errors

.ts to .d.ts & .js  as .c & .h
ts vs jsdoc
  - comments inside code for intellisence & autocomplete
  - making an object type
  - protection types (#property)
Type renames i.e. Guid = string
enum & namespace

https://dev.azure.com/skpazure/_git/DCH?path=/DCH.Website/wwwroot/js/shared/components/modal.js

# Fireship
## [TS with React, but should you?](https://www.youtube.com/watch?v=ydkQlJhodio)
* babel?
* JS vs TS
  - Silly bugs | More code
  - Selfwritten docs | Auto docs
  - Fast code now | Fast refactor later

## [Big projects are ditching TypeScript... why?](https://www.youtube.com/watch?v=5ChkQKUzDCs)
* 2012 - TS released
* A few years later, Angular uses ts
* 2020s ts everywhere
* Svelte & Turbo ditches ts
* Using JSDoc instead for types and intellisence
* Stage 1 ECMA propostal make type native to js

## [TypeScript in 100s](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
* TS compile language, js is compilation
* `tsc` command compiles to js

# External Sources
## [typescriptlang.org](https://www.typescriptlang.org/)
* Adding `// @ts-check` to a js file should add typescript-related errors
* Adding JSDoc
* Natural C#-like syntax

## [Turbo 8 is dropping TypeScript by David Heinmeier Hansson, 06/09/2023](https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01)
* Turbo is a bundler utility for ts/js files to one big file
* David Heinmeier Hasson: Danish programmer also founded Ruby on Rails
* Pollutes with "type gymnastics"
* "Things that should be easy become hard, and things that are hard become `any`. No thanks!"
* No longer develop ts but you can still use in ts

## [Svelte dropping TypeScript](https://news.ycombinator.com/item?id=35892250)
* Type changes won't affect Svelte users apart from "Go to definition" redirecting to source rather than unhelpful type declaration.
* TypeScript is a pain to run and compile rather than keeping it pure to the core
* SvelteKit designed in pure js and has been "miraculous for productivity".
* Change is also for the open-source community