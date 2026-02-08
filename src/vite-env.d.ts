/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types'
  export default function MDXContent(props: MDXProps): JSX.Element
}
