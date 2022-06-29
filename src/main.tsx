import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'

import { Editor } from 'pages'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RecoilRoot>
        <Editor />
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>
)
