import { assetsPlugin } from '@vuepress/markdown'
import type { MarkdownEnv } from '@vuepress/markdown'
import * as MarkdownIt from 'markdown-it'

describe('@vuepress/markdown > plugins > assetsPlugin', () => {
  describe('markdown image syntax', () => {
    const source = [
      // relative paths
      '![foo](./foo.png)',
      '![foo2](../sub/foo.png)',
      '![foo-bar](./foo/bar.png)',
      '![foo-bar2](../sub/foo/bar.png)',
      '![baz](../baz.png)',
      '![out](../../out.png)',
      '![汉字](./汉字.png)',
      '![100%](./100%.png)',
      // aliases
      '![alias](@alias/foo.png)',
      '![汉字](@alias/汉字.png)',
      '![100%](@alias/100%.png)',
      // webpack legacy aliases
      '![~alias](~@alias/foo.png)',
      '![~汉字](~@alias/汉字.png)',
      '![~100%](~@alias/100%.png)',
      // keep as is
      '![absolute](/absolute.png)',
      '![no-prefix](no-prefix.png)',
      '![url](http://foobar.com/icon.png)',
      '![empty]()',
      // invalid paths
      '![invalid](.../invalid.png)',
      '![汉字](.../汉字.png)',
      '![100%](.../100%.png)',
    ].join('\n\n')

    it('should handle assets link with default options', () => {
      const md = MarkdownIt().use(assetsPlugin)
      const env: MarkdownEnv = {
        filePathRelative: 'sub/foo.md',
      }

      const rendered = md.render(source, env)

      expect(rendered).toEqual(
        [
          // relative paths
          '<img src="@source/sub/foo.png" alt="foo">',
          '<img src="@source/sub/foo.png" alt="foo2">',
          '<img src="@source/sub/foo/bar.png" alt="foo-bar">',
          '<img src="@source/sub/foo/bar.png" alt="foo-bar2">',
          '<img src="@source/baz.png" alt="baz">',
          '<img src="@source/../out.png" alt="out">',
          '<img src="@source/sub/汉字.png" alt="汉字">',
          '<img src="@source/sub/100%.png" alt="100%">',
          // aliases
          '<img src="@alias/foo.png" alt="alias">',
          '<img src="@alias/汉字.png" alt="汉字">',
          '<img src="@alias/100%.png" alt="100%">',
          // webpack legacy aliases
          '<img src="~@alias/foo.png" alt="~alias">',
          '<img src="~@alias/汉字.png" alt="~汉字">',
          '<img src="~@alias/100%.png" alt="~100%">',
          // keep as is
          '<img src="/absolute.png" alt="absolute">',
          '<img src="no-prefix.png" alt="no-prefix">',
          '<img src="http://foobar.com/icon.png" alt="url">',
          '<img src="" alt="empty">',
          // invalid paths
          '<img src=".../invalid.png" alt="invalid">',
          '<img src=".../汉字.png" alt="汉字">',
          '<img src=".../100%.png" alt="100%">',
        ]
          .map((item) => `<p>${item}</p>`)
          .join('\n') + '\n'
      )
    })

    it('should respect `relativePathPrefix` option', () => {
      const md = MarkdownIt().use(assetsPlugin, {
        relativePathPrefix: '@foo',
      })
      const env: MarkdownEnv = {
        filePathRelative: 'sub/foo.md',
      }

      const rendered = md.render(source, env)

      expect(rendered).toEqual(
        [
          // relative paths
          '<img src="@foo/sub/foo.png" alt="foo">',
          '<img src="@foo/sub/foo.png" alt="foo2">',
          '<img src="@foo/sub/foo/bar.png" alt="foo-bar">',
          '<img src="@foo/sub/foo/bar.png" alt="foo-bar2">',
          '<img src="@foo/baz.png" alt="baz">',
          '<img src="@foo/../out.png" alt="out">',
          '<img src="@foo/sub/汉字.png" alt="汉字">',
          '<img src="@foo/sub/100%.png" alt="100%">',
          // aliases
          '<img src="@alias/foo.png" alt="alias">',
          '<img src="@alias/汉字.png" alt="汉字">',
          '<img src="@alias/100%.png" alt="100%">',
          // webpack legacy aliases
          '<img src="~@alias/foo.png" alt="~alias">',
          '<img src="~@alias/汉字.png" alt="~汉字">',
          '<img src="~@alias/100%.png" alt="~100%">',
          // keep as is
          '<img src="/absolute.png" alt="absolute">',
          '<img src="no-prefix.png" alt="no-prefix">',
          '<img src="http://foobar.com/icon.png" alt="url">',
          '<img src="" alt="empty">',
          // invalid paths
          '<img src=".../invalid.png" alt="invalid">',
          '<img src=".../汉字.png" alt="汉字">',
          '<img src=".../100%.png" alt="100%">',
        ]
          .map((item) => `<p>${item}</p>`)
          .join('\n') + '\n'
      )
    })

    it('should not handle assets link if `filePathRelative` is not provided', () => {
      const md = MarkdownIt().use(assetsPlugin)
      const env: MarkdownEnv = {}

      const rendered = md.render(source, env)

      expect(rendered).toEqual(
        [
          // relative paths
          '<img src="./foo.png" alt="foo">',
          '<img src="../sub/foo.png" alt="foo2">',
          '<img src="./foo/bar.png" alt="foo-bar">',
          '<img src="../sub/foo/bar.png" alt="foo-bar2">',
          '<img src="../baz.png" alt="baz">',
          '<img src="../../out.png" alt="out">',
          '<img src="./汉字.png" alt="汉字">',
          '<img src="./100%.png" alt="100%">',
          // aliases
          '<img src="@alias/foo.png" alt="alias">',
          '<img src="@alias/汉字.png" alt="汉字">',
          '<img src="@alias/100%.png" alt="100%">',
          // webpack legacy aliases
          '<img src="~@alias/foo.png" alt="~alias">',
          '<img src="~@alias/汉字.png" alt="~汉字">',
          '<img src="~@alias/100%.png" alt="~100%">',
          // keep as is
          '<img src="/absolute.png" alt="absolute">',
          '<img src="no-prefix.png" alt="no-prefix">',
          '<img src="http://foobar.com/icon.png" alt="url">',
          '<img src="" alt="empty">',
          // invalid paths
          '<img src=".../invalid.png" alt="invalid">',
          '<img src=".../汉字.png" alt="汉字">',
          '<img src=".../100%.png" alt="100%">',
        ]
          .map((item) => `<p>${item}</p>`)
          .join('\n') + '\n'
      )
    })
  })

  describe('html <img> tag', () => {
    const source = [
      // relative paths
      '<img src="./foo.png">',
      '<img src="../sub/foo.png">',
      '<img src="./foo/bar.png">',
      '<img src="../sub/foo/bar.png">',
      '<img src="../baz.png">',
      '<img src="../../out.png">',
      '<img src="./汉字.png">',
      '<img src="./100%.png">',
      '<img alt="attrs" src="./attrs.png" width="100px">',
      // aliases
      '<img src="@alias/foo.png">',
      '<img src="@alias/汉字.png">',
      '<img src="@alias/100%.png">',
      '<img alt="attrs" src="@alias/attrs.png" width="100px">',
      // webpack legacy aliases
      '<img src="~@alias/foo.png">',
      '<img src="~@alias/汉字.png">',
      '<img src="~@alias/100%.png">',
      '<img alt="attrs" src="~@alias/attrs.png" width="100px">',
      // keep as is
      '<img src="/absolute.png">',
      '<img src="no-prefix.png">',
      '<img src="http://foobar.com/icon.png">',
      '<img src="">',
      '<img alt="attrs" src="attrs.png" width="100px">',
      // invalid paths
      '<img src=".../invalid.png">',
      '<img src=".../汉字.png">',
      '<img src=".../100%.png">',
      '<img alt="attrs" src=".../attrs.png" width="100px">',
    ]

    it('should handle assets link with default options', () => {
      const md = MarkdownIt({ html: true }).use(assetsPlugin)
      const env: MarkdownEnv = {
        filePathRelative: 'sub/foo.md',
      }

      const expected = [
        // relative paths
        '<img src="@source/sub/foo.png">',
        '<img src="@source/sub/foo.png">',
        '<img src="@source/sub/foo/bar.png">',
        '<img src="@source/sub/foo/bar.png">',
        '<img src="@source/baz.png">',
        '<img src="@source/../out.png">',
        '<img src="@source/sub/汉字.png">',
        '<img src="@source/sub/100%.png">',
        '<img alt="attrs" src="@source/sub/attrs.png" width="100px">',
        // aliases
        '<img src="@alias/foo.png">',
        '<img src="@alias/汉字.png">',
        '<img src="@alias/100%.png">',
        '<img alt="attrs" src="@alias/attrs.png" width="100px">',
        // webpack legacy aliases
        '<img src="~@alias/foo.png">',
        '<img src="~@alias/汉字.png">',
        '<img src="~@alias/100%.png">',
        '<img alt="attrs" src="~@alias/attrs.png" width="100px">',
        // keep as is
        '<img src="/absolute.png">',
        '<img src="no-prefix.png">',
        '<img src="http://foobar.com/icon.png">',
        '<img src="">',
        '<img alt="attrs" src="attrs.png" width="100px">',
        // invalid paths
        '<img src=".../invalid.png">',
        '<img src=".../汉字.png">',
        '<img src=".../100%.png">',
        '<img alt="attrs" src=".../attrs.png" width="100px">',
      ]

      // block
      expect(md.render(source.join('\n\n'), env)).toEqual(
        expected.map((item) => `${item}`).join('\n')
      )

      // block with leading white space
      expect(
        md.render(source.map((item) => `   ${item}`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `   ${item}`).join('\n'))

      // inline with suffix
      expect(
        md.render(source.map((item) => `${item}foo`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `<p>${item}foo</p>`).join('\n') + '\n')

      // inline with line break
      expect(
        md.render(
          source.map((item) => item.replace('<img', '<img\n')).join('\n\n'),
          env
        )
      ).toEqual(
        expected
          .map((item) => `<p>${item.replace('<img', '<img\n')}</p>`)
          .join('\n') + '\n'
      )
    })

    it('should respect `relativePathPrefix` option', () => {
      const md = MarkdownIt({ html: true }).use(assetsPlugin, {
        relativePathPrefix: '@foo',
      })
      const env: MarkdownEnv = {
        filePathRelative: 'sub/foo.md',
      }

      const expected = [
        // relative paths
        '<img src="@foo/sub/foo.png">',
        '<img src="@foo/sub/foo.png">',
        '<img src="@foo/sub/foo/bar.png">',
        '<img src="@foo/sub/foo/bar.png">',
        '<img src="@foo/baz.png">',
        '<img src="@foo/../out.png">',
        '<img src="@foo/sub/汉字.png">',
        '<img src="@foo/sub/100%.png">',
        '<img alt="attrs" src="@foo/sub/attrs.png" width="100px">',
        // aliases
        '<img src="@alias/foo.png">',
        '<img src="@alias/汉字.png">',
        '<img src="@alias/100%.png">',
        '<img alt="attrs" src="@alias/attrs.png" width="100px">',
        // webpack legacy aliases
        '<img src="~@alias/foo.png">',
        '<img src="~@alias/汉字.png">',
        '<img src="~@alias/100%.png">',
        '<img alt="attrs" src="~@alias/attrs.png" width="100px">',
        // keep as is
        '<img src="/absolute.png">',
        '<img src="no-prefix.png">',
        '<img src="http://foobar.com/icon.png">',
        '<img src="">',
        '<img alt="attrs" src="attrs.png" width="100px">',
        // invalid paths
        '<img src=".../invalid.png">',
        '<img src=".../汉字.png">',
        '<img src=".../100%.png">',
        '<img alt="attrs" src=".../attrs.png" width="100px">',
      ]

      // block
      expect(md.render(source.join('\n\n'), env)).toEqual(
        expected.map((item) => `${item}`).join('\n')
      )

      // block with leading white space
      expect(
        md.render(source.map((item) => `   ${item}`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `   ${item}`).join('\n'))

      // inline with suffix
      expect(
        md.render(source.map((item) => `${item}foo`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `<p>${item}foo</p>`).join('\n') + '\n')

      // inline with line break
      expect(
        md.render(
          source.map((item) => item.replace('<img', '<img\n')).join('\n\n'),
          env
        )
      ).toEqual(
        expected
          .map((item) => `<p>${item.replace('<img', '<img\n')}</p>`)
          .join('\n') + '\n'
      )
    })

    it('should not handle assets link if `filePathRelative` is not provided', () => {
      const md = MarkdownIt({ html: true }).use(assetsPlugin)
      const env: MarkdownEnv = {}

      const expected = [
        // relative paths
        '<img src="./foo.png">',
        '<img src="../sub/foo.png">',
        '<img src="./foo/bar.png">',
        '<img src="../sub/foo/bar.png">',
        '<img src="../baz.png">',
        '<img src="../../out.png">',
        '<img src="./汉字.png">',
        '<img src="./100%.png">',
        '<img alt="attrs" src="./attrs.png" width="100px">',
        // aliases
        '<img src="@alias/foo.png">',
        '<img src="@alias/汉字.png">',
        '<img src="@alias/100%.png">',
        '<img alt="attrs" src="@alias/attrs.png" width="100px">',
        // webpack legacy aliases
        '<img src="~@alias/foo.png">',
        '<img src="~@alias/汉字.png">',
        '<img src="~@alias/100%.png">',
        '<img alt="attrs" src="~@alias/attrs.png" width="100px">',
        // keep as is
        '<img src="/absolute.png">',
        '<img src="no-prefix.png">',
        '<img src="http://foobar.com/icon.png">',
        '<img src="">',
        '<img alt="attrs" src="attrs.png" width="100px">',
        // invalid paths
        '<img src=".../invalid.png">',
        '<img src=".../汉字.png">',
        '<img src=".../100%.png">',
        '<img alt="attrs" src=".../attrs.png" width="100px">',
      ]

      // block
      expect(md.render(source.join('\n\n'), env)).toEqual(
        expected.map((item) => `${item}`).join('\n')
      )

      // block with leading white space
      expect(
        md.render(source.map((item) => `   ${item}`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `   ${item}`).join('\n'))

      // inline with suffix
      expect(
        md.render(source.map((item) => `${item}foo`).join('\n\n'), env)
      ).toEqual(expected.map((item) => `<p>${item}foo</p>`).join('\n') + '\n')

      // inline with line break
      expect(
        md.render(
          source.map((item) => item.replace('<img', '<img\n')).join('\n\n'),
          env
        )
      ).toEqual(
        expected
          .map((item) => `<p>${item.replace('<img', '<img\n')}</p>`)
          .join('\n') + '\n'
      )
    })
  })
})
