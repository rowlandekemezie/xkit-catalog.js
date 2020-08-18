import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { domReady } from './util'
import App, { AppOptions, isRouterType } from './ui/app'
import createXkit, { XkitJs } from '@xkit-co/xkit.js'

export interface CatalogOptions extends Omit<AppOptions, 'inheritRouter' | 'routerType'> {
  routerType: string
}

export interface XkitCatalog extends XkitJs {
  renderCatalog: (el: HTMLElement, opts: CatalogOptions) => void,
  unmountCatalog: (el: HTMLElement) => boolean
}

function renderCatalog(xkit: XkitJs, el: HTMLElement, opts: CatalogOptions): void {
  ReactDOM.render(
    <App
      xkit={xkit}
      rootPath={opts.rootPath}
      routerType={isRouterType(opts.routerType) ? opts.routerType : undefined}
      title={opts.title}
      hideTitle={opts.hideTitle}
    />,
    el
  )
}

function unmountCatalog(el: HTMLElement): boolean {
  return ReactDOM.unmountComponentAtNode(el)
}

function renderCatalogDefault (xkit: XkitJs, elemId = 'xkit-app'): void {
  domReady(document, () => {
    const domRoot = document.getElementById(elemId)

    // If the domRoot doesn't exist, we're probably not on the right page and we can skip rendering
    if (!domRoot) {
      return
    }

    const token = domRoot.dataset.token

    // Catalog-specific config
    const rootPath = domRoot.dataset.path
    const routerType = domRoot.dataset.router
    const title = domRoot.dataset.title
    const hideTitle = domRoot.dataset.hideTitle === 'true'

    // Attempt a login
    if (token) {
      const doLogin = async () => {
        try {
          await xkit.login(token)
        } catch (e) {
          console.debug(`Login failed: ${e.message}`, e)
        }
      }
      doLogin()
    }

    // Only render the app if we are allowed to render from anywhere (no root path),
    // we're using a memory router, or if we are on the correct path. This allows
    // a developer to include this script in every page and only have it render on the
    // correct page.
    if (!rootPath || routerType === 'memory' || window.location.pathname.startsWith(rootPath)) {
      renderCatalog(xkit, domRoot, {
        rootPath,
        routerType,
        title,
        hideTitle
      })
    }
  })
}

function createXkitWithCatalog (domain: string): XkitCatalog {
  const xkit = createXkit(domain)
  const xkitCatalog = Object.assign({}, xkit, {
    renderCatalog: renderCatalog.bind(null, xkit),
    renderCatalogDefault: renderCatalogDefault.bind(null, xkit),
    unmountCatalog
  })
  return xkitCatalog
}

export default createXkitWithCatalog