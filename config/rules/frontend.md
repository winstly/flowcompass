---
paths:
  - "**/*.test.{ts,tsx,js,jsx}"
  - "**/*.spec.{ts,tsx,js,jsx}"
  - "**/components/**/*.{ts,tsx,vue,svelte}"
  - "**/hooks/**/*.{ts,tsx}"
  - "**/stores/**/*.{ts,tsx}"
  - "**/styles/**/*.{css,scss,less}"
  - "**/__tests__/**/*.{ts,tsx}"
  - "**/src/**/*.{ts,tsx,js,jsx}"
---

# Frontend Development Rules

Based on Alibaba F2E Specification, Clean Code, Refactoring

---

## 1. General Formatting

### Indentation

| Rule | Level | Description |
|------|-------|-------------|
| Use 2 spaces for indentation | MUST | No tabs or 4 spaces |

```ini
# .editorconfig
indent_style = space
indent_size = 2
```

### Maximum Line Length

| Rule | Level | Description |
|------|-------|-------------|
| Max 100 characters per line | RECOMMENDED | Configure editor.rulers: [100] |

### Character Encoding

| Rule | Level | Description |
|------|-------|-------------|
| UTF-8 encoding | MUST | |

---

## 2. JavaScript Rules

### Semicolons & Commas

| Rule | Level | Description |
|------|-------|-------------|
| Use semicolons | MUST | End statements, avoid ASI quirks |
| Comma-first style forbidden | MUST | [comma-style](https://eslint.org/docs/rules/comma-style) |
| Trailing commas | MUST | [comma-dangle](https://eslint.org/docs/rules/comma-dangle) |

### Code Blocks

| Rule | Level | Description |
|------|-------|-------------|
| Always wrap blocks with braces | RECOMMENDED | [curly](https://eslint.org/docs/rules/curly) |
| Egyptian Brackets style | MUST | Space before `{` |
| Empty blocks must have braces | MUST | [no-empty](https://eslint.org/docs/rules/no-empty) |

```js
// ✅ Good - Egyptian Brackets
if (foo) {
  thing1();
} else {
  thing2();
}

// ❌ Bad
if (foo)
  thing1();
```

### Whitespace

| Rule | Level | Description |
|------|-------|-------------|
| Space before block `{` | MUST | |
| Space before control statement `(` | MUST | |
| No space between function name and `(` | MUST | |
| No space inside parentheses `()` | MUST | |
| Space inside braces `{}` | MUST | |
| Space around operators | MUST | Except unary operators |

### Empty Lines

| Rule | Level | Description |
|------|-------|-------------|
| One empty line at end of file | RECOMMENDED | [eol-last](https://eslint.org/docs/rules/eol-last) |
| No empty lines at block boundaries | MUST | [padded-blocks](https://eslint.org/docs/rules/padded-blocks) |

### Line Length Limits

| Rule | Level | Description |
|------|-------|-------------|
| Max 100 characters per line | RECOMMENDED | |
| Max 1000 lines per file | REFERENCE | |
| Max 80 lines per function | REFERENCE | |

### Variable Declarations

| Rule | Level | Description |
|------|-------|-------------|
| Use const or let, never var | MUST | |
| Correct const/let usage | MUST | [prefer-const](https://eslint.org/docs/rules/prefer-const) |
| One declaration per statement | MUST | [one-var](https://eslint.org/docs/rules/one-var) |
| No unused variables | MUST | [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars) |
| No use-before-define | MUST | [no-use-before-define](https://eslint.org/docs/rules/no-use-before-define) |
| No shadowing outer scope | MUST | [no-shadow](https://eslint.org/docs/rules/no-shadow) |
| No redeclaring variables | MUST | [no-redeclare](https://eslint.org/docs/rules/no-redeclare) |
| No consecutive assignments | MUST | [no-multi-assign](https://eslint.org/docs/rules/no-multi-assign) |

### Primitive Types

| Rule | Level | Description |
|------|-------|-------------|
| No new Number/String/Boolean | MUST | [no-new-wrappers](https://eslint.org/docs/rules/no-new-wrappers) |
| Correct type conversion methods | RECOMMENDED | Number(), String(), !! |
| parseInt() must have radix | RECOMMENDED | [radix](https://eslint.org/docs/rules/radix) |
| No unnecessary boolean cast | MUST | [no-extra-boolean-cast](https://eslint.org/docs/rules/no-extra-boolean-cast) |

### Strings

| Rule | Level | Description |
|------|-------|-------------|
| Single quotes preferred | MUST | [quotes](https://eslint.org/docs/rules/quotes) |
| Use template literals over concatenation | RECOMMENDED | [prefer-template](https://eslint.org/docs/rules/prefer-template) |
| No unnecessary escape characters | MUST | [no-useless-escape](https://eslint.org/docs/rules/no-useless-escape) |

### Arrays

| Rule | Level | Description |
|------|-------|-------------|
| Use literals for array creation | MUST | [no-array-constructor](https://eslint.org/docs/rules/no-array-constructor) |
| Array callbacks must have return | MUST | [array-callback-return](https://eslint.org/docs/rules/array-callback-return) |
| Use spread operator `...` | RECOMMENDED | Copy, transform, concatenate |
| Use destructuring for arrays | RECOMMENDED | |

### Objects

| Rule | Level | Description |
|------|-------|-------------|
| Use literals for object creation | MUST | [no-new-object](https://eslint.org/docs/rules/no-new-object) |
| Use shorthand property/method syntax | MUST | [object-shorthand](https://eslint.org/docs/rules/object-shorthand) |
| No quotes around property names | MUST | [quote-props](https://eslint.org/docs/rules/quote-props) |
| Prefer dot notation for access | MUST | [dot-notation](https://eslint.org/docs/rules/dot-notation) |
| Use spread operator `...` for objects | RECOMMENDED | Instead of Object.assign |
| Use destructuring for objects | RECOMMENDED | [prefer-destructuring](https://eslint.org/docs/rules/prefer-destructuring) |
| No direct Object.prototype calls | MUST | [no-prototype-builtins](https://eslint.org/docs/rules/no-prototype-builtins) |

### Functions

| Rule | Level | Description |
|------|-------|-------------|
| No Function constructor | MUST | [no-new-func](https://eslint.org/docs/rules/no-new-func) |
| No function declarations in blocks | MUST | [no-inner-declarations](https://eslint.org/docs/rules/no-inner-declarations) |
| Prefer function expressions | REFERENCE | Clearer semantics |
| Prefer arrow functions | MUST | [prefer-arrow-callback](https://eslint.org/docs/rules/prefer-arrow-callback) |
| No naming function params arguments | MUST | |
| No arguments object | MUST | [prefer-rest-params](https://eslint.org/docs/rules/prefer-rest-params) |
| Use default parameter syntax | RECOMMENDED | |
| Default params at end of list | RECOMMENDED | |
| No modifying function params | RECOMMENDED | [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign) |
| IIFE must be wrapped | MUST | [wrap-iife](https://eslint.org/docs/rules/wrap-iife) |
| Complexity < 10 | REFERENCE | [complexity](https://eslint.org/docs/rules/complexity) |
| Max 3 parameters | REFERENCE | [max-params](https://eslint.org/docs/rules/max-params) |

### Classes

| Rule | Level | Description |
|------|-------|-------------|
| Use class keyword | RECOMMENDED | |
| Use extends for inheritance | RECOMMENDED | |
| No unnecessary constructor | MUST | [no-useless-constructor](https://eslint.org/docs/rules/no-useless-constructor) |
| Correct super usage | MUST | [constructor-super](https://eslint.org/docs/rules/constructor-super) |
| No duplicate class members | MUST | [no-dupe-class-members](https://eslint.org/docs/rules/no-dupe-class-members) |

### Modules

| Rule | Level | Description |
|------|-------|-------------|
| Use ES6 modules | RECOMMENDED | |
| No duplicate imports | MUST | [import/no-duplicates](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md) |
| Imports at module top | MUST | [import/first](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md) |
| No circular dependencies | MUST | [import/no-cycle](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md) |
| Empty line after imports | RECOMMENDED | [import/newline-after-import](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md) |
| Sort imports | REFERENCE | [import/order](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md) |
| Default export when single export | REFERENCE | [import/prefer-default-export](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md) |

### Operators

| Rule | Level | Description |
|------|-------|-------------|
| Use strict equality | RECOMMENDED | [eqeqeq](https://eslint.org/docs/rules/eqeqeq) |
| No ++/-- operators | MUST | [no-plusplus](https://eslint.org/docs/rules/no-plusplus) |
| No void operator | MUST | [no-void](https://eslint.org/docs/rules/no-void) |
| No nested ternary | MUST | [no-nested-ternary](https://eslint.org/docs/rules/no-nested-ternary) |
| No unnecessary ternary | MUST | [no-unneeded-ternary](https://eslint.org/docs/rules/no-unneeded-ternary) |
| Group operators with parentheses | MUST | [no-mixed-operators](https://eslint.org/docs/rules/no-mixed-operators) |

### Control Statements

| Rule | Level | Description |
|------|-------|-------------|
| switch case must end with break | MUST | [no-fallthrough](https://eslint.org/docs/rules/no-fallthrough) |
| switch should have default | RECOMMENDED | [default-case](https://eslint.org/docs/rules/default-case) |
| switch should have 3+ cases | REFERENCE | |
| Max 4 nesting levels | REFERENCE | [max-depth](https://eslint.org/docs/rules/max-depth) |
| for loop counter direction | MUST | [for-direction](https://eslint.org/docs/rules/for-direction) |
| guard-for-in | RECOMMENDED | [guard-for-in](https://eslint.org/docs/rules/guard-for-in) |
| No else after return | REFERENCE | [no-else-return](https://eslint.org/docs/rules/no-else-return) |

### Other

| Rule | Level | Description |
|------|-------|-------------|
| No eval | MUST | [no-eval](https://eslint.org/docs/rules/no-eval) |
| No debugger | MUST | [no-debugger](https://eslint.org/docs/rules/no-debugger) |
| No alert | RECOMMENDED | [no-alert](https://eslint.org/docs/rules/no-alert) |
| No console in production | RECOMMENDED | [no-console](https://eslint.org/docs/rules/no-console) |
| No assigning to natives | MUST | [no-global-assign](https://eslint.org/docs/rules/no-global-assign) |

### Comments

| Rule | Level | Description |
|------|-------|-------------|
| Single-line: `//` | RECOMMENDED | Above the commented code |
| Multi-line: `/** */` | RECOMMENDED | |
| Space after comment markers | MUST | [spaced-comment](https://eslint.org/docs/rules/spaced-comment) |
| Use FIXME/TODO appropriately | REFERENCE | [no-warning-comments](https://eslint.org/docs/rules/no-warning-comments) |
| Use JSDoc for documentation | REFERENCE | |
| Delete obsolete comments | REFERENCE | |

### Naming Conventions

| Rule | Level | Description |
|------|-------|-------------|
| Files: lowercase with hyphens | REFERENCE | `user-profile.ts` |
| Variables/functions: camelCase | MUST | [camelcase](https://eslint.org/docs/rules/camelcase) |
| Classes: PascalCase | MUST | [new-cap](https://eslint.org/docs/rules/new-cap) |
| Constants: UPPER_SNAKE_CASE | REFERENCE | For exported const |
| No leading/trailing underscores | REFERENCE | [no-underscore-dangle](https://eslint.org/docs/rules/no-underscore-dangle) |

---

## 3. TypeScript Rules

### Type Declarations

| Rule | Level | Description |
|------|-------|-------------|
| Overloaded functions together | MUST | [adjacent-overload-signatures](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md) |
| Simple arrays: `T[]` | RECOMMENDED | [array-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/array-type.md) |
| TS comment directives need explanation | RECOMMENDED | [ban-ts-comment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-ts-comment.md) |
| No tslint comments | MUST | [ban-tslint-comment](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-tslint-comment.md) |
| Literal properties use readonly | RECOMMENDED | [class-literal-property-style](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/class-literal-property-style.md) |

### Type Assertions

| Rule | Level | Description |
|------|-------|-------------|
| Use `as Type` for assertions | MUST | [consistent-type-assertions](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-assertions.md) |
| No assertions on object literals | MUST | Except `any` |

### Interfaces & Types

| Rule | Level | Description |
|------|-------|-------------|
| Prefer interface for type definitions | RECOMMENDED | [consistent-type-definitions](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md) |
| Explicit member accessibility | RECOMMENDED | [explicit-member-accessibility](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md) |
| Use `;` as interface/type delimiter | MUST | [member-delimiter-style](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md) |
| Fixed member ordering | RECOMMENDED | [member-ordering](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md) |
| Method signatures as property style | RECOMMENDED | [method-signature-style](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/method-signature-style.md) |
| No empty interfaces | RECOMMENDED | [no-empty-interface](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-interface.md) |

### Forbidden Patterns

| Rule | Level | Description |
|------|-------|-------------|
| No meaningless void type | MUST | [no-invalid-void-type](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-void-type.md) |
| No namespace | MUST | [no-namespace](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-namespace.md) |
| No non-null after optional chain | MUST | [no-non-null-asserted-optional-chain](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md) |
| No module for namespaces | MUST | [prefer-namespace-keyword](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-namespace-keyword.md) |
| No `///` for imports | MUST | [triple-slash-reference](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md) |

### Other TypeScript Rules

| Rule | Level | Description |
|------|-------|-------------|
| No explicit type when inferrable | RECOMMENDED | [no-inferrable-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-inferrable-types.md) |
| ES2015 import syntax | RECOMMENDED | [no-require-imports](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-require-imports.md) |
| Don't alias this | RECOMMENDED | [no-this-alias](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-this-alias.md) |
| Prefer `as const` | RECOMMENDED | [prefer-as-const](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-as-const.md) |
| Same types for string concat | RECOMMENDED | [restrict-plus-operands](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-plus-operands.md) |
| Type annotation spacing | MUST | [type-annotation-spacing](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/type-annotation-spacing.md) |
| Members must have types | MUST | [typedef](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/typedef.md) |
| Single quotes for strings | MUST | |

---

## 4. React Rules

### JSX Formatting

| Rule | Level | Description |
|------|-------|-------------|
| JSX uses 2 spaces indent | MUST | [jsx-indent](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md) |
| Space before self-closing slash | MUST | `<Component />` [jsx-tag-spacing](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md) |
| Single space between JSX attributes | MUST | [jsx-props-no-multi-spaces](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md) |
| No space inside JSX curly braces | MUST | [jsx-curly-spacing](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md) |
| No space around JSX equals | MUST | [jsx-equals-spacing](https://eslint.org/docs/rules/jsx-equals-spacing) |
| Double quotes for JSX attributes | MUST | [jsx-quotes](https://eslint.org/docs/rules/jsx-quotes) |
| Wrap multiline JSX in parens | MUST | [jsx-wrap-multilines](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md) |

### Tags

| Rule | Level | Description |
|------|-------|-------------|
| Self-close tags without children | MUST | [self-closing-comp](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md) |
| Each prop on own line if many | MUST | [jsx-max-props-per-line](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md) |
| Closing bracket on own line | MUST | [jsx-closing-bracket-location](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md) |
| No dangerouslySetInnerHTML with children | MUST | [no-danger-with-children](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md) |
| Void elements no children | MUST | [void-dom-elements-no-children](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md) |
| Avoid dangerouslySetInnerHTML | RECOMMENDED | [no-danger](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md) |
| No JSX comment text nodes | MUST | [jsx-no-comment-textnodes](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md) |
| No unescaped entities in JSX | MUST | [no-unescaped-entities](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md) |

### Component Definition

| Rule | Level | Description |
|------|-------|-------------|
| One component per file | MUST | [no-multi-comp](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md) |
| No this in functional components | MUST | [no-this-in-sfc](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md) |
| Use ES6 class for class components | MUST | [prefer-es6-class](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md) |
| Stateless components use functions | REFERENCE | [prefer-stateless-function](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md) |

### Methods

| Rule | Level | Description |
|------|-------|-------------|
| No .bind() in JSX attributes | RECOMMENDED | [jsx-no-bind](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md) |
| render must have return value | MUST | [require-render-return](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md) |
| No ReactDOM.render return value | MUST | [no-render-return-value](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md) |
| PureComponent no shouldComponentUpdate | MUST | [no-redundant-should-component-update](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md) |
| No deprecated methods | MUST | [no-deprecated](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md) |
| No findDOMNode | MUST | [no-find-dom-node](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md) |
| No legacy lifecycle methods | MUST | componentWillMount, etc. |
| No state changes in componentWillUpdate | MUST | [no-will-update-set-state](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md) |

### Props

| Rule | Level | Description |
|------|-------|-------------|
| Prop names: camelCase | MUST | [no-unknown-property](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md) |
| All declared props used | MUST | [no-unused-prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md) |
| Destructuring for props/state | REFERENCE | [destructuring-assignment](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md) |
| Omit true for boolean props | MUST | `<Component active />` [jsx-boolean-value](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md) |
| Props need propTypes validation | RECOMMENDED | [prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md) |
| No vague prop type checkers | RECOMMENDED | [forbid-prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md) |
| Props need defaultProps | REFERENCE | [require-default-props](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md) |
| defaultProps match propTypes | MUST | [default-props-match-prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/default-props-match-prop-types.md) |
| No array index as map key | RECOMMENDED | [no-array-index-key](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md) |
| No children as prop name | MUST | [no-children-prop](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md) |
| No duplicate props | MUST | [jsx-no-duplicate-props](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md) |
| style prop must be object | MUST | [style-prop-object](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md) |
| No target='_blank' alone | RECOMMENDED | [jsx-no-target-blank](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md) |

### State

| Rule | Level | Description |
|------|-------|-------------|
| No this.state in setState | MUST | [no-access-state-in-setstate](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md) |
| All declared state used | MUST | [no-unused-state](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-state.md) |

### Refs

| Rule | Level | Description |
|------|-------|-------------|
| Use ref callbacks or React.createRef() | MUST | [no-string-refs](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md) |

### Hooks

| Rule | Level | Description |
|------|-------|-------------|
| Only call hooks at top level | MUST | [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level) |
| Hook names must start with use | MUST | camelCase |
| Only call from React functions/hooks | MUST | [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-from-react-functions) |
| Declare all useEffect dependencies | RECOMMENDED | [exhaustive-deps](https://github.com/facebook/react/issues/14920) |

### Naming

| Rule | Level | Description |
|------|-------|-------------|
| File extension: .jsx/.tsx | MUST | [jsx-filename-extension](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md) |
| Component: PascalCase; instance: camelCase | MUST | [jsx-pascal-case](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md) |
| HOC should have displayName | RECOMMENDED | |

---

## 5. CSS Rules

### Coding Style

| Rule | Level | Description |
|------|-------|-------------|
| Semicolons after declarations | MUST | [declaration-block-trailing-semicolon](https://stylelint.io/user-guide/rules/declaration-block-trailing-semicolon) |
| 2 spaces indent | RECOMMENDED | [indentation](https://stylelint.io/user-guide/rules/indentation) |
| Space before selector `{` | RECOMMENDED | [block-opening-brace-space-before](https://stylelint.io/user-guide/rules/block-opening-brace-space-before) |
| No space before colon, space after | RECOMMENDED | [declaration-colon-space-after](https://stylelint.io/user-guide/rules/declaration-colon-space-after) |
| Space before/after combinators | RECOMMENDED | [selector-combinator-space](https://stylelint.io/user-guide/rules/selector-combinator-space.md) |
| Space after comma in values | RECOMMENDED | [value-list-comma-space-after](https://stylelint.io/user-guide/rules/value-list-comma-space-after) |
| Closing brace on own line | RECOMMENDED | |
| One declaration per line | RECOMMENDED | [declaration-block-single-line-max-declarations](https://stylelint.io/user-guide/rules/declaration-block-single-line-max-declarations) |
| Max 100 characters | RECOMMENDED | [max-line-length](https://stylelint.io/user-guide/rules/max-line-length) |
| Each selector on own line | REFERENCE | [selector-list-comma-newline-after](https://stylelint.io/user-guide/rules/selector-list-comma-newline-after) |
| Always multi-line even for single | REFERENCE | |

### Selectors

| Rule | Level | Description |
|------|-------|-------------|
| No id selectors | REFERENCE | [selector-max-id](https://stylelint.io/user-guide/rules/selector-max-id) |
| Attribute values in quotes | REFERENCE | [selector-attribute-quotes](https://stylelint.io/user-guide/rules/selector-attribute-quotes) |
| Use class over element tags | REFERENCE | |
| Max 3 selectors in compound | REFERENCE | |

### Properties & Values

| Rule | Level | Description |
|------|-------|-------------|
| Use shortest hex | RECOMMENDED | [color-hex-length](https://stylelint.io/user-guide/rules/color-hex-length) |
| No !important | RECOMMENDED | |
| Lowercase hex values | RECOMMENDED | [color-hex-case](https://stylelint.io/user-guide/rules/color-hex-case) |
| Zero length without unit | RECOMMENDED | [length-zero-no-unit](https://stylelint.io/user-guide/rules/length-zero-no-unit) |
| Keep leading zero | REFERENCE | [number-leading-zero](https://stylelint.io/user-guide/rules/number-leading-zero) |
| Fixed declaration order | REFERENCE | Position > Box Model > Typography > Visual |
| Use shorthand when appropriate | REFERENCE | [declaration-block-no-shorthand-property-overrides](https://stylelint.io/user-guide/rules/declaration-block-no-shorthand-property-overrides) |

### Other CSS

| Rule | Level | Description |
|------|-------|-------------|
| No CSS @import | RECOMMENDED | Blocks rendering |

### Sass/Less

| Rule | Level | Description |
|------|-------|-------------|
| Space around operators | RECOMMENDED | |
| No space in mixin name parentheses | RECOMMENDED | |
| Order: @import, globals, styles | RECOMMENDED | |
| Standard, mixins, nested in blocks | RECOMMENDED | |
| Max 3 nesting levels | RECOMMENDED | |
| Use mixins not @extend | RECOMMENDED | |

---

## 6. HTML Rules

### DOCTYPE

| Rule | Level | Description |
|------|-------|-------------|
| Must have DOCTYPE | MUST | |
| HTML5 lowercase doctype | MUST | |

### HTML Element

| Rule | Level | Description |
|------|-------|-------------|
| Single root html element | MUST | |
| html must have lang attribute | MUST | |
| Only one head and one body | MUST | |

### Meta Elements

| Rule | Level | Description |
|------|-------|-------------|
| meta elements in head | MUST | |
| UTF-8 charset | MUST | |
| viewport meta for responsive | RECOMMENDED | |

### Resource Loading

| Rule | Level | Description |
|------|-------|-------------|
| Don't specify type for CSS/JS | RECOMMENDED | HTML5 defaults |
| CSS in head tag | RECOMMENDED | |
| JS before body end | RECOMMENDED | |
| Protocol-relative URLs | RECOMMENDED | |
| preload for critical resources | RECOMMENDED | |
| dns-prefetch for DNS lookup | RECOMMENDED | |

### Page Title

| Rule | Level | Description |
|------|-------|-------------|
| Exactly one title | MUST | |

### Coding Style

| Rule | Level | Description |
|------|-------|-------------|
| 2 spaces indent | RECOMMENDED | |
| Tag names lowercase | MUST | |
| Self-closing with space and slash | RECOMMENDED | |
| Attribute values in double quotes | MUST | |
| Boolean attributes without value | RECOMMENDED | |
| Custom attributes prefix data- | RECOMMENDED | |

### Comments

| Rule | Level | Description |
|------|-------|-------------|
| No sensitive info in comments | MUST | |
| Space between comment markers | RECOMMENDED | |
| Multi-line comment markers on own lines | RECOMMENDED | |

### Semantics & Accessibility

| Rule | Level | Description |
|------|-------|-------------|
| Use semantic HTML tags | REFERENCE | |
| Consider HTML accessibility | REFERENCE | |

---

## 7. Node.js Rules

### Coding Style

| Rule | Level | Description |
|------|-------|-------------|
| Use Node.js built-in globals | RECOMMENDED | [node/prefer-global](https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/prefer-global) |
| Use promises API | RECOMMENDED | [node/prefer-promises](https://github.com/mysticatea/eslint-plugin-node/tree/master/docs/rules/prefer-promises) |
| Module order: node > npm > local | RECOMMENDED | |
| Throw native Error objects | RECOMMENDED | [no-throw-literal](https://eslint.org/docs/rules/no-throw-literal) |
| No sync fs/child_process in prod | RECOMMENDED | |

### Security

| Rule | Level | Description |
|------|-------|-------------|
| Hide error details from client | MUST | |
| Hide/fake stack trace headers | MUST | |
| JSONP CORS validate origin | MUST | |
| No user ID from params/plain cookies | MUST | |
| Prevent SQL injection | MUST | Use prepared statements |
| Check for deprecated dependencies | RECOMMENDED | |
| Don't store uploads locally | RECOMMENDED | Use OSS |
| URL redirect whitelist | RECOMMENDED | |
| Strict input validation | RECOMMENDED | |

### Best Practices

| Rule | Level | Description |
|------|-------|-------------|
| Applications should be stateless | RECOMMENDED | |
| No Node.js hosting static files | RECOMMENDED | |
| CPU tasks to reverse proxy | RECOMMENDED | |
| Use async/await | RECOMMENDED | |
| Use util.promisify for callbacks | RECOMMENDED | |
| Use native Promise | RECOMMENDED | |
| Methods return this for chaining | RECOMMENDED | |

---

## 8. Git Conventions

### Commit Message Format

```
<type>[scope]: <description>
```

**Language**: English for international projects

**Type Types**:
| type | meaning |
|------|---------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting (no logic change) |
| test | Test cases |
| refactor | Refactor/optimize |
| chore | Engineering |
| revert | Revert commit |

**Rules**:
- Use present tense
- Use imperative mood
- No capitalization at start
- No punctuation at end

### Branch Naming

**Permanent branches**:
- `main`: Main branch

**Temporary branches**:
```
<type>/[issue-number][handler]<description>
```

Examples:
```
feat/shopping-cart
feat/1023-crash-on-search
```

### Tag Naming

- Version follows SemVer
- Tags on main branch
- Prefix with v: `v1.0.0`

---

## 9. Documentation Writing

### Whitespace

| Rule | Level | Description |
|------|-------|-------------|
| Space between Chinese and English | MUST | |
| Space between Chinese and numbers | MUST | |
| No space around Chinese punctuation | MUST | |
| Space around half-width punctuation | MUST | |
| No space around link text | RECOMMENDED | |

### Punctuation

| Rule | Level | Description |
|------|-------|-------------|
| Correct quote usage | RECOMMENDED | Chinese quotes for English sentences |
| Correct ellipsis | RECOMMENDED | Chinese "……", English "..." |
| Correct dash | RECOMMENDED | Chinese "——" |

### Full-width & Half-width

| Rule | Level | Description |
|------|-------|-------------|
| Chinese punctuation: full-width | MUST | |
| English and numbers: half-width | MUST | |
| English sentences use half-width punctuation | MUST | |

### Nouns

| Rule | Level | Description |
|------|-------|-------------|
| Correct English proper noun spelling | MUST | |

---

## 10. Changelog Conventions

### File

| Rule | Level | Description |
|------|-------|-------------|
| File must be named CHANGELOG.md | MUST | |
| Use standard Markdown syntax | MUST | |
| Located in project root | MUST | |

### Format

| Rule | Level | Description |
|------|-------|-------------|
| Title: "Change Log" | MUST | |
| Content by version descending | MUST | |
| Version follows SemVer | MUST | |
| Version number with link | RECOMMENDED | |
| Date: yyyy-MM-dd | MUST | |
| Types link to Git commit types | RECOMMENDED | |

---

##配套工具 / Complementary Tools

| Specification | Tool | Rule Pack |
|--------------|------|----------|
| JavaScript/TypeScript/React/Node.js | ESLint | [eslint-config-ali](https://www.npmjs.com/package/eslint-config-ali) |
| CSS | stylelint | [stylelint-config-ali](https://www.npmjs.com/package/stylelint-config-ali) |
| Git | commitlint | [commitlint-config-ali](https://www.npmjs.com/package/commitlint-config-ali) |
| Documentation | markdownlint | [markdownlint-config-ali](https://www.npmjs.com/package/markdownlint-config-ali) |
| All-in-one | F2ELint | [f2elint](https://www.npmjs.com/package/f2elint) |

---

## Severity Levels

| Level | Description |
|-------|-------------|
| MUST | Will cause errors or issues if violated |
| RECOMMENDED | Improves quality and maintainability |
| REFERENCE | Adjust per project needs |