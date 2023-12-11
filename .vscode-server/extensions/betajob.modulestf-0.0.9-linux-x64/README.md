[![modules.tf](https://img.shields.io/badge/modules.tf-Terraform%20extension%20for%20VS%20Code%20by%20Betajob-5c4ee5.svg)](https://modules.tf)&nbsp;&nbsp; [![@modulestf](https://img.shields.io/twitter/follow/modulestf?style=social)](https://twitter.com/modulestf)


# Modules.tf - Terraform extension for Visual Studio Code

This extension is [Betajob](https://www.betajob.com/)'s foot in the wide-open door called "Terraform extensions for IDEs." This early release is intentionally very limited in functionality.

Features like [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense), linting, code navigation, code formatting, and complete code explorer are coming soon.

At [Betajob](https://www.betajob.com/), we aim to raise Terraform and Terragrunt developer experience to a completely different level! Wish us luck!

![Demo workflow](https://github.com/modulestf/public/raw/master/assets/modulestf-demo1.gif)

## Key Features

<details>
  <summary>Syntax highlighting</summary>

By default, colorization in VS Code is syntactic/lexical and leverages TextMate grammar to associate named 'scopes' with syntactic elements.

This extension provides two ways of highlighting:
- **syntactic/lexical** and leverages TextMate grammar to associate named 'scopes' with syntactic elements
- **semantic** colorization leverages the same system of associating colors with named scopes. But, some tokens that can be colored by semantic colorization in Terraform/HCL do not have existing analogs in VS Code's TextMate grammar. So, new named scopes are required. Because these scopes are new, existing themes do not include colors for them either, so we have created copies of the default VS Code themes with new tokens.
</details>

<br/>

## FAQ:

<details>
  <summary>How to enable semantic highlighting?</summary>

  Put this setting into VS Code `settings.json` file:

  ```json
  "editor.semanticHighlighting.enabled": true
  ```
</details>

<details>
  <summary>How to customize colors?</summary>

  ### TextMate scopes

  - Place this section in your `settings.json` file to customize styles of Textmate scope (one scope or or a group of scopes): `modulestf.punctuation.bracket` (all brackets) or `modulestf.punctuation` (all punctuation symbols).

  ```json
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "modulestf.punctuation",
        "settings": {
          "foreground": "#5386b1",
          "fontStyle": "italic bold underline"
        }
      }
    ]
  }
  ```

  ### Semantic Tokens

  - Place this section in your `settings.json` file to enable semantic token colors customization (globally or per theme).
  - Token can be combined with language prefix (`terraform`, `terragrunt`, `tfvars`).

  ```json
  "editor.semanticTokenColorCustomizations": {
    "rules": {
      "block-type": "#FF0",
      "block-name": "#FFA",
      "block-id": "#FFF",
      "value-number:tfvars": "#F0F",
      "property:terraform": {
        "foreground": "#F00",
        "italic": true
      }
    },
    "[Default Dark+]": {
      "enabled": true,
      "rules": {
        "string-quote": {
          "foreground": "#FF0",
          "italic": true
        },
        "variable:terraform": "#F00"
      }
    }
  }
  ```

  Follow this [official guide for VS Code](https://code.visualstudio.com/docs/getstarted/themes#_editor-semantic-highlighting) for more information.

</details>

<details>
  <summary>Show all available TextMate scopes and semantic tokens.</summary>

<!-- HIGHLIGHTS -->
### Semantic Token Types

|        Semantic Token Id        |              TextMate scope               |                                     Description                                     |
|---------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------|
|`block-id`                       |`modulestf.block.id`                       |Style for the second tag of a block (e.g. `this` in `resource "aws_vpc" "this" {}`)  |
|`block-name`                     |`modulestf.block.name`                     |Style for the first tag of a block (e.g. `aws_vpc` in `resource "aws_vpc" "this" {}`)|
|`block-tag`                      |`modulestf.block.tag`                      |Style for the third and other block tags                                             |
|`block-type`                     |`modulestf.block.type`                     |Style for the block's type (e.g. `resource` in `resource "aws_vpc" "this" {}`)       |
|`comment`                        |`modulestf.comment`                        |Style for comment lines and comment blocks                                           |
|`function`                       |`modulestf.function`                       |Style for function identifiers                                                       |
|`keyword`                        |`modulestf.keyword`                        |Style for keywords (`if`, `else`, `endif`, `for`, `in`, `endfor`)                    |
|`operator-arithmetic`            |`modulestf.operator.arithmetic`            |Style for `arithmetic` operators (`+`, `-`, `/`, `*`, `%`)                           |
|`operator-assign`                |`modulestf.operator.assign`                |Style for `assignment` operator (`=`)                                                |
|`operator-comma`                 |`modulestf.operator.comma`                 |Style for `commas` (e.g. list elements)                                              |
|`operator-compare`               |`modulestf.operator.compare`               |Style for `compare` operators (`>`, `<`, `>=`, `<=`, `==`, `!=`)                     |
|`operator-for-arrow`             |`modulestf.operator.for.arrow`             |Style for `arrow` operator in `for expressions` (`=>`)                               |
|`operator-logical`               |`modulestf.operator.logical`               |Style for `logical` operators (`||`, `&&`, `!`)                                      |
|`operator-reference`             |`modulestf.operator.reference`             |Style for `dots` in references                                                       |
|`operator-spread`                |`modulestf.operator.spread`                |Style for `spread` operator (`...`)                                                  |
|`operator-ternary`               |`modulestf.operator.ternary`               |Style for `ternary` operators (... `?` ... `:` ...)                                  |
|`operator-unary-negation`        |`modulestf.operator.unary.negation`        |Style for `unary negation` operator (`-`)                                            |
|`operator-unary-not`             |`modulestf.operator.unary.not`             |Style for `unary not` operator (`!`)                                                 |
|`property`                       |`modulestf.property`                       |Style for `property type` in variables (e.g. `var` in `var.name`)                    |
|`property-reference`             |`modulestf.property.reference`             |Style for `property reference` in variables (e.g. `name` in `var.name`)              |
|`punctuation-block`              |`modulestf.punctuation.block`              |Style for `block` symbols (`{`, `}`)                                                 |
|`punctuation-bracket`            |`modulestf.punctuation.bracket`            |Style for `bracket` symbols (`(`, `)`)                                               |
|`punctuation-bracket-function`   |`modulestf.punctuation.bracket.function`   |Style for `bracket` in `function arguments` (`(`, `)`)                               |
|`punctuation-comma`              |`modulestf.punctuation.comma`              |Style for `comma` symbol between arguments                                           |
|`punctuation-directive`          |`modulestf.punctuation.directive`          |Style for `template directive` symbols (`%{`, `}`)                                   |
|`punctuation-for-colon`          |`modulestf.punctuation.for.colon`          |Style for `colon` symbol in `for expressions`                                        |
|`punctuation-for-comma`          |`modulestf.punctuation.for.comma`          |Style for `comma` symbol in `for expressions`                                        |
|`punctuation-for-object`         |`modulestf.punctuation.for.object`         |Style for `object` symbols in `for expressions` (`{`, `}`)                           |
|`punctuation-for-tuple`          |`modulestf.punctuation.for.tuple`          |Style for `tuple` symbols in `for expressions` (`[`, `]`)                            |
|`punctuation-heredoc-align`      |`modulestf.punctuation.heredoc.align`      |Style for `align` symbols in `heredoc` (`-`)                                         |
|`punctuation-heredoc-arrow`      |`modulestf.punctuation.heredoc.arrow`      |Style for `arrow` symbols in `heredoc` (`<<`)                                        |
|`punctuation-heredoc-marker`     |`modulestf.punctuation.heredoc.marker`     |Style for `marker` symbols in `heredoc` (e.g. `EOF`)                                 |
|`punctuation-interpolation`      |`modulestf.punctuation.interpolation`      |Style for `template interpolation` symbols (``)                               |
|`punctuation-interpolation-strip`|`modulestf.punctuation.interpolation.strip`|Style for `strip` symbol in interpolations (`~`)                                     |
|`punctuation-object`             |`modulestf.punctuation.object`             |Style for `object` symbols (`{`, `}`)                                                |
|`punctuation-tuple`              |`modulestf.punctuation.tuple`              |Style for `tuple` symbols (`[`, `]`)                                                 |
|`punctuation-tuple-index`        |`modulestf.punctuation.tuple.index`        |Style for `index brackets` in `tuple` (`[`, `]`)                                     |
|`punctuation-tuple-splat`        |`modulestf.punctuation.tuple.splat`        |Style for `splat brackets` in `tuple` (`[`, `]`)                                     |
|`splat-attr`                     |`modulestf.splat.attr`                     |Style for `splat` symbol in attributes (`*`)                                         |
|`splat-full`                     |`modulestf.splat.full`                     |Style for `full splat` symbol (`*`)                                                  |
|`string-heredoc`                 |`modulestf.string.heredoc`                 |Style for a `heredoc body`                                                           |
|`string-quote`                   |`modulestf.string.quote`                   |Style for a quoted string body                                                       |
|`string-quote-marker`            |`modulestf.string.quote.marker`            |Style for a quoted string double quote markers                                       |
|`string-template`                |`modulestf.string.template`                |Style for a string between template directives                                       |
|`value-boolean-false`            |`modulestf.value.boolean.false`            |Style for `boolean` values (`false`)                                                 |
|`value-boolean-true`             |`modulestf.value.boolean.true`             |Style for `boolean` values (`true`)                                                  |
|`value-null`                     |`modulestf.value.null`                     |Style for `null` values                                                              |
|`value-number`                   |`modulestf.value.number`                   |Style for `numerical` values                                                         |
|`variable`                       |`modulestf.variable`                       |Style for variable identifiers                                                       |
|`variable-for`                   |`modulestf.variable.for`                   |Style for `variable` in `for expressions`                                            |

### Semantic Token Modifiers

|Semantic Token Modifier|                               Description                               |
|-----------------------|-------------------------------------------------------------------------|
|`oneline`              |Differentiates oneline blocks (e.g. `locals { ... }` written in one line)|
<!-- END HIGHLIGHTS -->

</details>

<!--
<details>
  <summary>more features coming</summary>
</details>
-->

<br />

## Questions, issues, and feature requests

- If you come across a problem with the extension, please [file an issue](https://github.com/modulestf/public)
- If someone has already [filed an issue](https://github.com/modulestf/public) that encompasses your feedback, please leave a 👍/👎 reaction on the issue


## Stay tuned and follow the progress!

<!-- [![@modulestf](https://img.shields.io/twitter/follow/modulestf.svg?style=flat&label=Follow%20@modulestf%20on%20Twitter)](https://twitter.com/modulestf) -->

Let us know your feedback in Twitter ([@modulestf](https://twitter.com/modulestf) or [@antonbabenko](https://twitter.com/antonbabenko)) or [email](mailto:anton@betajob.com?subject=Feedback%20on%20modules.tf%20extension%20for%20vscode).

<!--
## License

Please note that [modules.tf](https://modules.tf) is a commercial product and will require a license after a free trial period. -->
