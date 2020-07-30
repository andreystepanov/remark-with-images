# remark-with-images

> [remark](https://github.com/remarkjs/remark) plugin to get all images from `markdown` as an `array` and optionally update/replace them

# Installation

```
npm install remark-with-images --save
```

# Usage

Say we have the following file, `example.md`:

```markdown
# Title

Some text with inline ![image 1](https://images.com/1.jpg)

Some other text...

![image 2](https://images.com/2.jpg)

Rest of the text...
```

And you `javascript` might look like:

```javascript
import vfile from 'to-vfile'
import remark from 'remark'
import withImages from 'remark-with-images'

const parse = await (data) => {
  const {
    contents: markdown,
    data: { images }
  } = await remark()
    .use(withImages)
    .process(data)

  // do something with markdown and images array

  return {
    markdown,
    images
  }
}

parse(vfile.readSync('example.md'))
```

`images` array would have this schema:

```json
[
  {
    "alt": "image 1",
    "original_url": "https://images.com/1.jpg"
  },
  {
    "alt": "image 2",
    "original_url": "https://images.com/2.jpg"
  }
]
```

You also might want to reupload those images to some other place and then replace all the references. It's easy to do by just providing `replace` option:

```javascript
import vfile from 'to-vfile'
import remark from 'remark'
import withImages from 'remark-with-images'

const replace = async (url, alt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUrl = url.replace('images.com', 'cloud.images.com')

      resolve(newUrl)
    }, 1000)
  })
}

const parse = await (data) => {
  const {
    contents: markdown,
    data: { images }
  } = await remark()
    .use(withImages, { replace })
    .process(data)

  // do something with updated markdown and images array

  return {
    markdown,
    images
  }
}

parse(vfile.readSync('example.md'))
```

`markdown` will become:

```markdown
# Title

Some text with inline ![image 1](https://cloud.images.com/1.jpg)

Some other text...

![image 2](https://cloud.images.com/2.jpg)

Rest of the text...
```

And `images` array would be:

```json
[
  {
    "alt": "image 1",
    "original_url": "https://images.com/1.jpg",
    "url": "https://cloud.images.com/1.jpg"
  },
  {
    "alt": "image 2",
    "original_url": "https://images.com/2.jpg",
    "url": "https://cloud.images.com/2.jpg"
  }
]
```
