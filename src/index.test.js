import withImages from './'
import remark from 'remark'

// prettier-ignore
const data = `
  # Title

  Some text with inline ![image 1](https://images.com/1.jpg)

  Some other text...

  ![image 2](https://images.com/2.jpg)

  Rest of the text...
`

async function parse(data, options) {
  const vfile = await remark().use(withImages, options).process(data)

  return {
    markdown: vfile.contents,
    images: vfile.data.images,
  }
}

test('defined', () => {
  expect(multilineCode).toBeDefined()
  expect(typeof multilineCode).toBe('function')
})

test('throws error if replace function fails', async () => {
  await parse(data, {
    replace: async url => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (url.includes('1.jpg')) {
            return reject(new Error('Upload error'))
          }

          resolve(url.replace('images.com', 'cloud.images.com'))
        }, 2000)
      })
    },
  }).catch(e => {
    expect(e.url).toMatchSnapshot()
  })
})

test('replaces all image urls', async () => {
  const { markdown, images } = await parse(data, {
    replace: async url => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(url.replace('images.com', 'cloud.images.com'))
        }, 500)
      })
    },
  })

  expect(markdown).toMatchSnapshot()
  expect(images).toMatchSnapshot()
})
