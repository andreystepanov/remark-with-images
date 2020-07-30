import visit from 'unist-util-visit'

export default function withImages(options) {
  const { replace } = options || {}

  return async function transform(tree, vfile) {
    if (!(vfile && vfile.data && vfile.data.images)) {
      vfile.data.images = []
    }

    const nodes = []

    async function processNode(node) {
      const { alt, url } = node
      if (url) {
        const image = {
          alt,
          original_url: url,
        }

        if (replace && typeof replace === 'function') {
          try {
            const updated = await replace(url, alt)

            if (typeof updated === 'string') {
              image.url = updated
              node.url = updated
            }
          } catch (err) {
            err.url = url
            throw err
          }
        }

        vfile.data.images.push(image)
      }
    }

    visit(tree, 'image', node => {
      nodes.push(node)
    })

    await Promise.all(nodes.map(node => processNode(node)))

    return tree
  }
}
